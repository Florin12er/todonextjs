import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Task, Column } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type TaskColumnProps = {
  column: Column;
  index: number;
  onAddTask: (task: Omit<Task, "id">) => Promise<void>;
  onUpdateTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onUpdateColumn: (column: Column) => Promise<void>;
  onDeleteColumn: (columnId: string) => Promise<void>;
};

export function TaskColumn({
  column,
  index,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateColumn,
  onDeleteColumn,
}: TaskColumnProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = async () => {
    if (newTaskTitle.trim() !== "") {
      await onAddTask({
        title: newTaskTitle,
        description: "",
        dueDate: new Date(),
        completed: false,
        isToday: false,
        columnId: column.id,
        projectId: null,
      });
      setNewTaskTitle("");
    }
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="bg-gray-100 p-4 rounded-lg"
        >
          <h2
            {...provided.dragHandleProps}
            className="text-lg font-semibold mb-2"
          >
            {column.title}
          </h2>
          <Button
            onClick={() => onDeleteColumn(column.id)}
            variant="destructive"
            size="sm"
          >
            Delete Column
          </Button>
          <div className="mb-2">
            <Input
              type="text"
              placeholder="New task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="mr-2"
            />
            <Button onClick={addTask} size="sm">
              Add Task
            </Button>
          </div>
          <Droppable droppableId={column.id} type="TASK">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {column.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-2 mb-2 rounded"
                      >
                        {task.title}
                        <Button
                          onClick={() => onDeleteTask(task.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
