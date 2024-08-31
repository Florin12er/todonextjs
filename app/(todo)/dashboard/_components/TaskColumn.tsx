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
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 transition-colors duration-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center text-gray-800 dark:text-gray-200">
              <span
                {...provided.dragHandleProps}
                className="mr-3 cursor-move text-gray-500 dark:text-gray-400"
              >
                <GripVertical size={24} />
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
                  className="text-xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 dark:text-gray-200"
                  autoFocus
                />
              ) : (
                <span
                  onClick={startEditingColumnName}
                  className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {column.title}
                </span>
              )}
            </h2>
            <Button
              onClick={() => onDeleteColumn(column.id)}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
            >
              <Trash2 size={20} />
            </Button>
          </div>
          <div className="mb-6">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="New task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="mr-2 flex-grow bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <Button
                onClick={addTask}
                size="sm"
                className="whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus size={18} className="mr-1" /> Add
              </Button>
            </div>
          </div>
          <Droppable droppableId={column.id} type="TASK">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[100px] space-y-3"
              >
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between ${
                          task.completed ? "bg-gray-100 dark:bg-gray-600" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-grow">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => onToggleTaskCompletion(task)}
                            className="w-5 h-5 text-blue-500 dark:text-blue-400"
                          />
                          {editingTaskId === task.id ? (
                            <Input
                              type="text"
                              value={editingTaskTitle}
                              onChange={(e) =>
                                setEditingTaskTitle(e.target.value)
                              }
                              className="flex-grow text-sm bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 dark:text-gray-200"
                            />
                          ) : (
                            <span
                              className={`text-sm font-medium truncate mr-2 ${
                                task.completed
                                  ? "line-through text-gray-500 dark:text-gray-400"
                                  : "text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {task.title}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {editingTaskId === task.id ? (
                            <>
                              <Button
                                onClick={() => saveEditedTask(task)}
                                variant="ghost"
                                size="sm"
                                className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              >
                                <CheckCircle2 size={16} />
                              </Button>
                              <Button
                                onClick={cancelEditingTask}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <X size={16} />
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => startEditingTask(task)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Edit2 size={16} />
                            </Button>
                          )}
                          <Button
                            onClick={() => onDeleteTask(task.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
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
