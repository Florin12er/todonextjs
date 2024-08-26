"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { TaskColumn } from "./TaskColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

type Task = {
  id: number;
  title: string;
  status: string;
  dueDate: Date;
};

type TaskBoardPageProps = {
  initialTasks?: Task[];
  initialStatuses?: string[];
  onAddTask?: (task: Omit<Task, "id">) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onAddStatus?: (status: string) => void;
};

export function TaskBoardPage({
  initialTasks = [],
  initialStatuses = ["Todo", "In Progress", "Done"],
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddStatus,
}: TaskBoardPageProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [statuses, setStatuses] = useState<string[]>(initialStatuses);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    setStatuses(initialStatuses);
  }, [initialStatuses]);

  const addTask = (title: string, status: string) => {
    const newTask = {
      id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
      title,
      status,
      dueDate: new Date(),
    };
    if (onAddTask) {
      onAddTask({ title, status, dueDate: new Date() });
    } else {
      setTasks([...tasks, newTask]);
    }
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask) {
      const newTask = { ...updatedTask, ...updates };
      if (onUpdateTask) {
        onUpdateTask(newTask);
      } else {
        setTasks(tasks.map((task) => (task.id === id ? newTask : task)));
      }
    }
  };

  const removeTask = (id: number) => {
    if (onDeleteTask) {
      onDeleteTask(id);
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const addColumn = () => {
    if (newColumnTitle.trim() !== "") {
      if (onAddStatus) {
        onAddStatus(newColumnTitle);
      } else {
        setStatuses([...statuses, newColumnTitle]);
      }
      setNewColumnTitle("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "COLUMN") {
      const newStatuses = Array.from(statuses);
      const [reorderedStatus] = newStatuses.splice(source.index, 1);
      newStatuses.splice(destination.index, 0, reorderedStatus);
      setStatuses(newStatuses);
      return;
    }

    const start = source.droppableId;
    const finish = destination.droppableId;

    if (start === finish) {
      const columnTasks = tasks.filter((task) => task.status === start);
      const reorderedTasks = Array.from(columnTasks);
      const [reorderedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, reorderedTask);

      const newTasks = tasks.map((task) =>
        task.status === start
          ? reorderedTasks[reorderedTasks.findIndex((t) => t.id === task.id)] ||
            task
          : task,
      );

      setTasks(newTasks);
      if (onUpdateTask) {
        newTasks.forEach((task) => {
          if (task.status === start) {
            onUpdateTask(task);
          }
        });
      }
    } else {
      const startTasks = tasks.filter((task) => task.status === start);
      const finishTasks = tasks.filter((task) => task.status === finish);
      const [movedTask] = startTasks.splice(source.index, 1);
      const updatedMovedTask = { ...movedTask, status: finish };
      finishTasks.splice(destination.index, 0, updatedMovedTask);

      const newTasks = tasks.map((task) => {
        if (task.status === start)
          return startTasks.find((t) => t.id === task.id) || task;
        if (task.status === finish)
          return finishTasks.find((t) => t.id === task.id) || task;
        return task;
      });

      setTasks(newTasks);
      if (onUpdateTask) {
        onUpdateTask(updatedMovedTask);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task Board</h1>

        <div className="flex mb-4">
          <Input
            type="text"
            placeholder="New column title"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className="mr-2"
          />
          <Button onClick={addColumn}>
            <Plus className="mr-2 h-4 w-4" /> Add Column
          </Button>
        </div>

        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {statuses.map((status, index) => (
                <TaskColumn
                  key={status}
                  status={status}
                  index={index}
                  tasks={tasks.filter((task) => task.status === status)}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onRemoveTask={removeTask}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
