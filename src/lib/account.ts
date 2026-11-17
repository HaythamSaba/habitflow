import { supabase } from "./supabase";
import { toDayKey } from "./dates";

/**
 * Account-level actions from Settings (audit R17): download everything the
 * user has stored, and delete the account.
 */

/** Supabase returns at most 1000 rows per request, so bigger tables are paged. */
const PAGE_SIZE = 1000;

/** Increment when the export's shape changes, so old files can be told apart. */
const EXPORT_FORMAT_VERSION = 1;

/** Calls `fetchPage(from, to)` (inclusive range) until a page comes back short. */
export async function fetchAllPages<T>(
  fetchPage: (from: number, to: number) => Promise<T[]>,
  pageSize: number = PAGE_SIZE,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const page = await fetchPage(from, from + pageSize - 1);
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

/** e.g. "habitflow-export-2026-11-17.json" (local date) */
export function exportFileName(date: Date = new Date()): string {
  return `habitflow-export-${toDayKey(date)}.json`;
}

interface TableQuery {
  table: string;
  select: string;
  /** Unique, stable ordering, so paging never skips or repeats a row */
  orderBy: string[];
}

const EXPORT_TABLES = {
  profile: { table: "user_profiles", select: "*", orderBy: ["user_id"] },
  stats: { table: "user_stats", select: "*", orderBy: ["user_id"] },
  categories: { table: "categories", select: "*", orderBy: ["created_at", "id"] },
  habits: { table: "habits", select: "*", orderBy: ["created_at", "id"] },
  completions: {
    table: "completions",
    select: "*",
    orderBy: ["completed_at", "id"],
  },
  achievements: {
    table: "user_achievements",
    select: "*, achievement:achievements(key, name)",
    orderBy: ["unlocked_at", "id"],
  },
} satisfies Record<string, TableQuery>;

type ExportSection = keyof typeof EXPORT_TABLES;

async function fetchUserRows(userId: string, query: TableQuery) {
  return fetchAllPages(async (from, to) => {
    let request = supabase
      .from(query.table)
      .select(query.select)
      .eq("user_id", userId);
    for (const column of query.orderBy) {
      request = request.order(column, { ascending: true });
    }
    const { data, error } = await request.range(from, to);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as Record<string, unknown>[];
  });
}

/** Everything stored for this user, as one JSON-ready object. */
export async function buildUserExport(user: {
  id: string;
  email?: string;
  created_at?: string;
}) {
  const sections = Object.keys(EXPORT_TABLES) as ExportSection[];
  const results = await Promise.all(
    sections.map((section) => fetchUserRows(user.id, EXPORT_TABLES[section])),
  );
  const data = Object.fromEntries(
    sections.map((section, i) => [section, results[i]]),
  ) as Record<ExportSection, Record<string, unknown>[]>;

  return {
    app: "HabitFlow",
    formatVersion: EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    account: { id: user.id, email: user.email, createdAt: user.created_at },
    // One row each; null if it was never created
    profile: data.profile[0] ?? null,
    stats: data.stats[0] ?? null,
    categories: data.categories,
    habits: data.habits,
    completions: data.completions,
    achievements: data.achievements,
  };
}

/** Saves `data` as a pretty-printed JSON file via the browser's download. */
export function downloadJson(fileName: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Permanently deletes the signed-in user's account and all of its data (the
 * delete_my_account RPC in supabase/schema.sql; every table cascades from
 * auth.users).
 */
export async function deleteMyAccount(): Promise<void> {
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw new Error(error.message);
}
