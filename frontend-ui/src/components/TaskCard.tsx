import { useState } from "react";
import type { Task, TaskStatus } from "@/types/task";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateTaskStatus } from "@/queries/useUpdateTaskStatus";
import { useAnalyseTask } from "@/queries/useAnalyseTask";

interface TaskCardProps {
  task: Task;
}

const PRIORITY_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "destructive",
};

export function TaskCard({ task }: TaskCardProps) {
  const [statusError, setStatusError] = useState<string | null>(null);
  const updateStatus = useUpdateTaskStatus();
  const analyse = useAnalyseTask();

  function handleStatusChange(value: string) {
    setStatusError(null);
    updateStatus.mutate(
      { id: task.id, status: value as TaskStatus },
      {
        onError: (error: Error) => {
          setStatusError(
            error.message || "Failed to update status. Please try again.",
          );
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{task.title}</CardTitle>
          <Badge variant={PRIORITY_VARIANT[task.priority] ?? "outline"}>
            {task.priority}
          </Badge>
        </div>
        <CardDescription>
          {new Date(task.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{task.description}</p>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Status:
          </span>
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {statusError && (
          <Alert variant="destructive">
            <AlertTitle>Status update failed</AlertTitle>
            <AlertDescription>{statusError}</AlertDescription>
          </Alert>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => analyse.mutate(task.id)}
          disabled={analyse.isPending}
        >
          {analyse.isPending ? "Analysing..." : "Analyse with AI"}
        </Button>

        {analyse.isPending && <Skeleton className="h-20 w-full" />}

        {analyse.isError && (
          <Alert variant="destructive">
            <AlertTitle>AI analysis failed</AlertTitle>
            <AlertDescription>{analyse.error.message}</AlertDescription>
          </Alert>
        )}

        {analyse.data && (
          <div className="rounded-lg border bg-muted/50 p-3 text-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Category:</span>
              <Badge variant="outline">{analyse.data.category}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Priority:</span>
              <Badge
                variant={PRIORITY_VARIANT[analyse.data.priority] ?? "outline"}
              >
                {analyse.data.priority}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Summary:</span>{" "}
              {analyse.data.summary}
            </div>
            <div>
              <span className="font-medium">Recommended action:</span>{" "}
              {analyse.data.recommendedAction}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
