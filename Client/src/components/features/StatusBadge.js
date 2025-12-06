import { cn } from "@/lib/utils";

export function StatusBadge({ status }) {
  const styles = {
    todo: "bg-gray-100 text-gray-700 border-gray-200",
    in_progress: "bg-blue-50 text-blue-700 border-blue-200",
    done: "bg-green-50 text-green-700 border-green-200",
  };

  const labels = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  const normalizedStatus = status?.toLowerCase().replace(' ', '_') || 'todo';

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap",
        styles[normalizedStatus] || styles.todo
      )}
    >
      {labels[normalizedStatus] || status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const styles = {
    low: "bg-slate-100 text-slate-700 border-slate-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  const normalizedPriority = priority?.toLowerCase() || 'low';

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap",
        styles[normalizedPriority] || styles.low
      )}
    >
      {labels[normalizedPriority] || priority}
    </span>
  );
}
