"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { TaskColumn } from "./TaskColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Task, Column } from "@/types/task";

type TaskBoardPageProps = {
  columns: Column[];
  onAddTask: (task: Omit<Task, "id">) => Promise<void>;
  onUpdateTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onAddColumn: (column: Omit<Column, "id">) => Promise<void>;
  onUpdateColumn: (column: Column) => Promise<void>;
  onDeleteColumn: (columnId: string) => Promise<void>;
};

export function TaskBoardPage({
  columns,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddColumn,
  onUpdateColumn,
  onDeleteColumn,
}: TaskBoardPageProps) {
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const addColumn = async () => {
    if (newColumnTitle.trim() !== "") {
      await onAddColumn({
        title: newColumnTitle,
        order: columns.length,
        tasks: [],
      });
      setNewColumnTitle("");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "COLUMN") {
      const newColumns = Array.from(columns);
      const [reorderedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, reorderedColumn);

      for (let i = 0; i < newColumns.length; i++) {
        await onUpdateColumn({ ...newColumns[i], order: i });
      }
      return;
    }

    const startColumn = columns.find((col) => col.id === source.droppableId);
    const finishColumn = columns.find(
      (col) => col.id === destination.droppableId,
    );

    if (!startColumn || !finishColumn) return;

    if (startColumn === finishColumn) {
      const newTasks = Array.from(startColumn.tasks);
      const [reorderedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, reorderedTask);

      const updatedColumn = {
        ...startColumn,
        tasks: newTasks,
      };

      await onUpdateColumn(updatedColumn);
    } else {
      const startTasks = Array.from(startColumn.tasks);
      const [movedTask] = startTasks.splice(source.index, 1);
      const finishTasks = Array.from(finishColumn.tasks);
      finishTasks.splice(destination.index, 0, movedTask);

      const updatedStartColumn = {
        ...startColumn,
        tasks: startTasks,
      };

      const updatedFinishColumn = {
        ...finishColumn,
        tasks: finishTasks,
      };

      await onUpdateColumn(updatedStartColumn);
      await onUpdateColumn(updatedFinishColumn);
      await onUpdateTask({ ...movedTask, columnId: finishColumn.id });
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
              {columns.map((column, index) => (
                <TaskColumn
                  key={column.id}
                  column={column}
                  index={index}
                  onAddTask={onAddTask}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  onUpdateColumn={onUpdateColumn}
                  onDeleteColumn={onDeleteColumn}
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
