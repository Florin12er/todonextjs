"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Edit2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Task } from "@/types/task";

type TaskListPageProps = {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => Promise<void>;
  onUpdateTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
};

export function TaskListPage({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TaskListPageProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  const addTask = () => {
    if (newTaskTitle.trim() !== "") {
      const newTask: Omit<Task, "id"> = {
        title: newTaskTitle,
        description: "",
        dueDate: null,
        completed: false,
        isToday: false,
        projectId: null,
        columnId: null,
        order: tasks.length,
      };
      onAddTask(newTask);
      setNewTaskTitle("");
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    await onUpdateTask(updatedTask);
  };

  const updateTaskDueDate = async (
    id: string,
    newDate: Date | null | undefined,
  ) => {
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask) {
      const newTask = { ...updatedTask, dueDate: newDate ?? null };
      await onUpdateTask(newTask);
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

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Tasks</h2>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="New task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-grow dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          <Button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${
              task.completed
                ? "bg-gray-100 dark:bg-gray-800"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            <div className="flex items-center space-x-3 flex-grow">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleTaskCompletion(task)}
                className={`${
                  task.completed
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-400 dark:text-gray-300"
                } hover:bg-transparent dark:hover:bg-transparent`}
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </Button>
              {editingTaskId === task.id ? (
                <Input
                  type="text"
                  value={editingTaskTitle}
                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                  className="flex-grow dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
              ) : (
                <span
                  className={`${
                    task.completed
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : "dark:text-white"
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
                    variant="ghost"
                    size="sm"
                    onClick={() => saveEditedTask(task)}
                    className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditingTask}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditingTask(task)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    size="sm"
                  >
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {task.dueDate
                      ? format(new Date(task.dueDate), "MMM d")
                      : "Set date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 dark:bg-gray-800">
                  <Calendar
                    mode="single"
                    selected={task.dueDate ? new Date(task.dueDate) : undefined}
                    onSelect={(date) => updateTaskDueDate(task.id, date)}
                    initialFocus
                    className="dark:bg-gray-800 dark:text-white"
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteTask(task.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
