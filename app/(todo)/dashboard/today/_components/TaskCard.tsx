import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { TaskContextMenu } from "./TaskContextMenu";
import { format } from "date-fns";

type Task = {
  id: number;
  title: string;
  status: string;
  dueDate: Date;
};

type TaskCardProps = {
  task: Task;
  index: number;
  onUpdate: (id: number, updates: Partial<Task>) => void;
  onRemove: (id: number) => void;
};

export function TaskCard({ task, index, onUpdate, onRemove }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2 p-2 bg-secondary rounded-lg flex justify-between items-center"
        >
          <div>
            <div>{task.title}</div>
            <div className="text-sm text-muted-foreground">
              Due: {format(task.dueDate, "PP")}
            </div>
          </div>
          <TaskContextMenu
            task={task}
            onStatusChange={(newStatus) =>
              onUpdate(task.id, { status: newStatus })
            }
            onDateChange={(newDate) => onUpdate(task.id, { dueDate: newDate })}
            onDelete={() => onRemove(task.id)}
          >
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </TaskContextMenu>
        </div>
      )}
    </Draggable>
  );
}
