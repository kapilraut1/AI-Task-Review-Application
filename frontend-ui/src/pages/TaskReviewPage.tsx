import { useState } from "react";
import type { TaskStatus } from "@/types/task";
import { useTasks } from "@/queries/useTasks";
import { StatusFilter } from "@/components/StatusFilter";
import { TaskList } from "@/components/TaskList";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskReviewPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const { data: tasks, isLoading, isError, error } = useTasks(statusFilter || undefined);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Task Review</h1>
        <p className="text-muted-foreground">
          Review and manage tasks, update statuses, and analyse with AI.
        </p>
      </header>

      <StatusFilter value={statusFilter} onChange={setStatusFilter} />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load tasks</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {tasks && tasks.length === 0 && (
        <p className="text-center text-muted-foreground">No tasks found.</p>
      )}

      {tasks && tasks.length > 0 && <TaskList tasks={tasks} />}
    </div>
  );
}
