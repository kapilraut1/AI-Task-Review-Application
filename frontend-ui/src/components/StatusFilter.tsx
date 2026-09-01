import type { TaskStatus } from "@/types/task";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface StatusFilterProps {
  value: TaskStatus | "";
  onChange: (value: TaskStatus | "") => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        Filter by status:
      </span>
      <Select
        value={value === "" ? "ALL" : value}
        onValueChange={(v) => onChange(v === "ALL" ? "" : (v as TaskStatus))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="NEW">New</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
