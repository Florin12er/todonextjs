import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "./TaskCard";
import { AddTaskInput } from "./AddTaskInput";

type Task = {
  id: number;
  title: string;
  status: string;
  dueDate: Date;
};

type TaskColumnProps = {
  status: string;
  index: number;
  tasks: Task[];
  onAddTask: (title: string, status: string) => void;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onRemoveTask: (id: number) => void;
};

export function TaskColumn({
  status,
  index,
  tasks,
  onAddTask,
  onUpdateTask,
  onRemoveTask,
}: TaskColumnProps) {
  return (
    <Draggable draggableId={status} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Card>
            <CardHeader>
              <CardTitle {...provided.dragHandleProps}>{status}</CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId={status} type="TASK">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        onUpdate={onUpdateTask}
                        onRemove={onRemoveTask}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <AddTaskInput onAddTask={(title) => onAddTask(title, status)} />
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
