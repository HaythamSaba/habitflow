import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import {
  createCompletion,
  deleteCompletion,
  updateUserPoints,
} from "@/lib/api";
import { POINTS_PER_COMPLETION } from "@/lib/points";
import { isNewPerfectDay } from "@/lib/analytics";
import { celebrate } from "@/lib/celebration";
import { showCheckInToast, showPerfectDayToast } from "@/lib/checkInToasts";
import { Completion, Habit } from "@/types";
import { toast } from "react-hot-toast";

/** What to do, decided by the caller from what the user sees */
export type ToggleCompletionVariables =
  | { habit: Habit; action: "add" }
  | { habit: Habit; action: "remove"; completionId: string };

/**
 * The check-in change was saved but the follow-up points update failed.
 * The two writes aren't atomic yet, so report this case separately instead
 * of telling the user the whole action failed.
 */
class PointsSyncError extends Error {
  readonly checkInAdded: boolean;

  constructor(checkInAdded: boolean) {
    super("Points update failed");
    this.checkInAdded = checkInAdded;
  }
}

async function syncPoints(userId: string, delta: number, checkInAdded: boolean) {
  try {
    await updateUserPoints(userId, delta);
  } catch {
    throw new PointsSyncError(checkInAdded);
  }
}

type UserStatsCache = { total_points: number } & Record<string, unknown>;

/**
 * Adds or removes one check-in. The UI updates instantly (optimistic) and
 * rolls back if the server rejects the change; every outcome ends with a
 * refetch so the screen matches what was saved.
 */
export function useToggleCompletion() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;
  const todayKey = ["completions", userId];
  const allKey = ["all-completions", userId];
  const statsKey = ["user-stats", userId];
  const habitsKey = ["habits", userId];

  // The Undo button in the toast calls back into this mutation
  const mutateRef = useRef<(variables: ToggleCompletionVariables) => void>(
    () => {},
  );

  const mutation = useMutation({
    mutationFn: async (
      variables: ToggleCompletionVariables,
    ): Promise<Completion | null> => {
      if (!user) throw new Error("Not authenticated");

      if (variables.action === "add") {
        const completion = (await createCompletion(
          variables.habit.id,
          user.id,
        )) as Completion;
        await syncPoints(user.id, POINTS_PER_COMPLETION, true);
        return completion;
      }

      await deleteCompletion(variables.completionId, user.id);
      await syncPoints(user.id, -POINTS_PER_COMPLETION, false);
      return null;
    },

    onMutate: async (variables) => {
      await Promise.all(
        [todayKey, allKey, statsKey].map((queryKey) =>
          queryClient.cancelQueries({ queryKey }),
        ),
      );

      const previousToday =
        queryClient.getQueryData<Completion[]>(todayKey) ?? [];
      const previousAll = queryClient.getQueryData<Completion[]>(allKey);
      const previousStats = queryClient.getQueryData<UserStatsCache>(statsKey);

      const tempId = `temp-${crypto.randomUUID()}`;
      let update: (list: Completion[]) => Completion[];
      if (variables.action === "add") {
        const now = new Date().toISOString();
        const optimistic: Completion = {
          id: tempId,
          habit_id: variables.habit.id,
          user_id: userId ?? "",
          completed_at: now,
          notes: null,
          mood_rating: null,
          created_at: now,
        };
        // Newest first, matching the server's ordering
        update = (list) => [optimistic, ...list];
      } else {
        update = (list) => list.filter((c) => c.id !== variables.completionId);
      }

      const nextToday = update(previousToday);
      queryClient.setQueryData<Completion[]>(todayKey, nextToday);
      queryClient.setQueryData<Completion[]>(allKey, (old) =>
        old ? update(old) : old,
      );

      const delta =
        variables.action === "add"
          ? POINTS_PER_COMPLETION
          : -POINTS_PER_COMPLETION;
      queryClient.setQueryData<UserStatsCache>(statsKey, (old) =>
        old ? { ...old, total_points: old.total_points + delta } : old,
      );

      // Did this change complete every active habit for today?
      const activeHabits = (
        queryClient.getQueryData<Habit[]>(habitsKey) ?? []
      ).filter((habit) => !habit.archived);

      return {
        previousToday,
        previousAll,
        previousStats,
        tempId,
        becamePerfectDay: isNewPerfectDay(activeHabits, previousToday, nextToday),
        habitCount: activeHabits.length,
      };
    },

    onSuccess: (completion, variables, context) => {
      // Swap the temporary row for the saved one so later removals use a real id
      if (variables.action === "add" && completion?.id && context) {
        const swap = (list?: Completion[]) =>
          list?.map((c) => (c.id === context.tempId ? completion : c));
        queryClient.setQueryData<Completion[]>(todayKey, swap);
        queryClient.setQueryData<Completion[]>(allKey, swap);
      }

      const undo: ToggleCompletionVariables | null =
        variables.action === "remove"
          ? { habit: variables.habit, action: "add" }
          : completion?.id
            ? {
                habit: variables.habit,
                action: "remove",
                completionId: completion.id,
              }
            : null;

      showCheckInToast({
        habitId: variables.habit.id,
        habitName: variables.habit.name,
        added: variables.action === "add",
        points: POINTS_PER_COMPLETION,
        onUndo: undo ? () => mutateRef.current(undo) : undefined,
      });

      if (context?.becamePerfectDay) {
        celebrate();
        showPerfectDayToast(context.habitCount);
      }
    },

    onError: (error, _variables, context) => {
      if (context) {
        // Points never changed on the server in any failure case
        queryClient.setQueryData(statsKey, context.previousStats);
        // A PointsSyncError means the check-in change itself was saved
        if (!(error instanceof PointsSyncError)) {
          queryClient.setQueryData(todayKey, context.previousToday);
          queryClient.setQueryData(allKey, context.previousAll);
        }
      }

      if (error instanceof PointsSyncError) {
        toast.error(
          error.checkInAdded
            ? "Check-in saved, but your points couldn't be updated."
            : "Check-in removed, but your points couldn't be updated.",
        );
        return;
      }
      toast.error(`Failed to update habit: ${error.message}`);
    },

    // Refetch after every outcome so the UI matches what was saved
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      queryClient.invalidateQueries({ queryKey: ["all-completions"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });

  useEffect(() => {
    mutateRef.current = mutation.mutate;
  }, [mutation.mutate]);

  return mutation;
}
