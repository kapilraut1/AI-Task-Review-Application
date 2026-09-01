import { useMutation } from "@tanstack/react-query";
import type { AiAnalysis } from "@/types/task";
import { analyseTask } from "@/api/tasks";

export function useAnalyseTask() {
  return useMutation<AiAnalysis, Error, string>({
    mutationFn: (id: string) => analyseTask(id),
  });
}
