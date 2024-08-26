"use client";

import { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { TaskColumn } from "./TaskColumn";

type Task = {
  id: number;
  title: string;
  status: string;
  dueDate: Date;
};

const initialTasks = [
  {
    id: 1,
    title: "Complete project proposal",
    status: "In Progress",
    dueDate: new Date(2023, 7, 15),
  },
  {
    id: 2,
    title: "Review team performance",
    status: "Todo",
    dueDate: new Date(2023, 7, 20),
  },
  {
    id: 3,
    title: "Prepare presentation",
    status: "Done",
    dueDate: new Date(2023, 7, 18),
  },
];

const initialStatuses = ["Todo", "In Progress", "Done"];

export default function TaskBoardPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [statuses, setStatuses] = useState<string[]>(initialStatuses);

  const addTask = (title: string, status: string) => {
    const newTask = {
      id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
      title,
      status,
      dueDate: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
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
    } else {
      const startTasks = tasks.filter((task) => task.status === start);
      const finishTasks = tasks.filter((task) => task.status === finish);
      const [movedTask] = startTasks.splice(source.index, 1);
      finishTasks.splice(destination.index, 0, {
        ...movedTask,
        status: finish,
      });

      const newTasks = tasks.map((task) => {
        if (task.status === start)
          return startTasks.find((t) => t.id === task.id) || task;
        if (task.status === finish)
          return finishTasks.find((t) => t.id === task.id) || task;
        return task;
      });

      setTasks(newTasks);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task Board</h1>

        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
