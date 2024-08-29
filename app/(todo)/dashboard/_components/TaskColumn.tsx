import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Task, Column } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Edit2,
  X,
  CheckCircle2,
} from "lucide-react";

type TaskColumnProps = {
  column: Column;
  index: number;
  onAddTask: (task: Omit<Task, "id">) => Promise<void>;
  onUpdateTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onUpdateColumn: (column: Column) => Promise<void>;
  onDeleteColumn: (columnId: string) => Promise<void>;
  onToggleTaskCompletion: (task: Task) => Promise<void>;
};

export function TaskColumn({
  column,
  index,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateColumn,
  onDeleteColumn,
  onToggleTaskCompletion,
}: TaskColumnProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [isEditingColumnName, setIsEditingColumnName] = useState(false);
  const [editingColumnName, setEditingColumnName] = useState(column.title);

  const addTask = async () => {
    if (newTaskTitle.trim() !== "") {
      await onAddTask({
        title: newTaskTitle,
        description: "",
        dueDate: null,
        completed: false,
        isToday: false,
        columnId: column.id,
        projectId: null,
        order: column.tasks.length,
      });
      setNewTaskTitle("");
    }
  };
  const startEditingColumnName = () => {
    setIsEditingColumnName(true);
    setEditingColumnName(column.title);
  };

  const saveEditedColumnName = async () => {
    if (editingColumnName.trim() !== "" && editingColumnName !== column.title) {
      const updatedColumn = { ...column, title: editingColumnName };
      await onUpdateColumn(updatedColumn);
      setIsEditingColumnName(false);
    } else {
      setEditingColumnName(column.title);
      setIsEditingColumnName(false);
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditingTaskTitle("");
  };

  const saveEditedTask = async (task: Task) => {
    if (editingTaskTitle.trim() !== "") {
      const updatedTask = { ...task, title: editingTaskTitle };
      await onUpdateTask(updatedTask);
      setEditingTaskId(null);
      setEditingTaskTitle("");
    }
  };

  const tasks = Array.isArray(column.tasks) ? column.tasks : [];

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="bg-gray-100 p-4 rounded-lg shadow-md w-80"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <span {...provided.dragHandleProps} className="mr-2 cursor-move">
                <GripVertical size={20} />
              </span>
              {isEditingColumnName ? (
                <Input
                  type="text"
                  value={editingColumnName}
                  onChange={(e) => setEditingColumnName(e.target.value)}
                  onBlur={saveEditedColumnName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveEditedColumnName();
                    }
                  }}
                  className="text-lg font-semibold"
                  autoFocus
                />
              ) : (
                <span onClick={startEditingColumnName}>{column.title}</span>
              )}
            </h2>
            <Button
              onClick={() => onDeleteColumn(column.id)}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="New task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="mr-2 flex-grow"
              />
              <Button onClick={addTask} size="sm" className="whitespace-nowrap">
                <Plus size={16} className="mr-1" /> Add
              </Button>
            </div>
          </div>
          <Droppable droppableId={column.id} type="TASK">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[100px]"
              >
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white p-3 mb-2 rounded shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between ${
                          task.completed ? "bg-gray-100" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-2 flex-grow">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => onToggleTaskCompletion(task)}
                            className="w-4 h-4"
                          />
                          {editingTaskId === task.id ? (
                            <Input
                              type="text"
                              value={editingTaskTitle}
                              onChange={(e) =>
                                setEditingTaskTitle(e.target.value)
                              }
                              className="flex-grow text-sm"
                            />
                          ) : (
                            <span
                              className={`text-sm font-medium truncate mr-2 ${task.completed ? "line-through text-gray-500" : ""}`}
                            >
                              {task.title}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {editingTaskId === task.id ? (
                            <>
                              <Button
                                onClick={() => saveEditedTask(task)}
                                variant="ghost"
                                size="sm"
                                className="text-green-500 hover:text-green-700"
                              >
                                <CheckCircle2 size={14} />
                              </Button>
                              <Button
                                onClick={cancelEditingTask}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={14} />
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => startEditingTask(task)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit2 size={14} />
                            </Button>
                          )}
                          <Button
                            onClick={() => onDeleteTask(task.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
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
