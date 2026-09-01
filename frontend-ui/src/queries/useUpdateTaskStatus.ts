import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TaskStatus } from "@/types/task";
import { updateTaskStatus } from "@/api/tasks";

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
