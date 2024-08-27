"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
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

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="New task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={addTask}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${
              task.completed ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleTaskCompletion(task)}
                className={task.completed ? "text-green-500" : "text-gray-400"}
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </Button>
              <span
                className={task.completed ? "line-through text-gray-500" : ""}
              >
                {task.title}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {task.dueDate
                      ? format(new Date(task.dueDate), "MMM d")
                      : "Set date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={task.dueDate ? new Date(task.dueDate) : undefined}
                    onSelect={(date) => updateTaskDueDate(task.id, date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
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
