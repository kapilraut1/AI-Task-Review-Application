import type { Task, TaskStatus, AiAnalysis } from "@/types/task";
import { apiFetch } from "./client";

export function fetchTasks(status?: TaskStatus): Promise<Task[]> {
  const params = status ? `?status=${status}` : "";
  return apiFetch<Task[]>(`/tasks${params}`);
}

export function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export function analyseTask(id: string): Promise<AiAnalysis> {
  return apiFetch<AiAnalysis>(`/tasks/${id}/analyse`, { method: "POST" });
}
