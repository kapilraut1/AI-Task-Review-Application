import { useQuery } from "@tanstack/react-query";
import type { TaskStatus } from "@/types/task";
import { fetchTasks } from "@/api/tasks";

export function useTasks(status?: TaskStatus) {
  return useQuery({
    queryKey: ["tasks", status] as const,
    queryFn: () => fetchTasks(status),
  });
}
