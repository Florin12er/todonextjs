import { Calendar } from "@/components/ui/calendar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { format } from "date-fns";

type Task = {
  id: number;
  title: string;
  status: string;
  dueDate: Date;
};

type TaskContextMenuProps = {
  children: React.ReactNode;
  task: Task;
  onStatusChange: (newStatus: string) => void;
  onDateChange: (newDate: Date) => void;
  onDelete: () => void;
};

export function TaskContextMenu({
  children,
  task,
  onStatusChange,
  onDateChange,
  onDelete,
}: TaskContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={() => onStatusChange("Todo")}>
          Set to Todo
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onStatusChange("In Progress")}>
          Set to In Progress
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onStatusChange("Done")}>
          Set to Done
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Change Due Date</ContextMenuSubTrigger>
          <ContextMenuSubContent className="p-0">
            <Calendar
              mode="single"
              selected={task.dueDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-red-600">
          Delete Task
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
