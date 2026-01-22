// src/components/habits/HabitList.tsx
import { Habit } from "@/types"
import { HabitCard } from "./HabitCard"

interface HabitListProps {
  habits: Habit[]
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

export function HabitList({ habits, onEdit, onDelete }: HabitListProps) {
  return (
    <div className="flex flex-col gap-6">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}