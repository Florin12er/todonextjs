"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { Task, Column } from "@/types/task";

type TaskListPageProps = {
  initialTasks: Task[];
  columns: Column[];
  onAddTask: (task: Omit<Task, "id">) => Promise<void>;
  onUpdateTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
};

export function TaskListPage({
  initialTasks,
  columns,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TaskListPageProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const addTask = () => {
    if (newTaskTitle.trim() !== "" && columns.length > 0) {
      const newTask: Omit<Task, "id"> = {
        title: newTaskTitle,
        description: "",
        dueDate: new Date(),
        completed: false,
        isToday: false,
        columnId: columns[0].id,
        projectId: null,
      };
      onAddTask(newTask);
      setNewTaskTitle("");
    }
  };

  const removeTask = (id: string) => {
    onDeleteTask(id);
  };

  const updateTaskStatus = (id: string, newColumnId: string) => {
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask) {
      const newTask = { ...updatedTask, columnId: newColumnId };
      onUpdateTask(newTask);
    }
  };

  const updateTaskDueDate = (id: string, newDate: Date | undefined) => {
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask) {
      const newTask = { ...updatedTask, dueDate: newDate ?? null };
      onUpdateTask(newTask);
    }
  };
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newTasks = Array.from(tasks);
    const [reorderedTask] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, reorderedTask);

    setTasks(newTasks);

    // Update task positions
    newTasks.forEach((task, index) => {
      if (task.id !== tasks[index].id) {
        onUpdateTask(task);
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>

      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="mr-2"
        />
        <Button onClick={addTask}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Droppable droppableId="taskList">
            {(provided) => (
              <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TableCell>{task.title}</TableCell>
                        <TableCell>
                          <Select
                            value={task.columnId || undefined}
                            onValueChange={(newColumnId) =>
                              updateTaskStatus(task.id, newColumnId)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {columns.map((column) => (
                                <SelectItem key={column.id} value={column.id}>
                                  {column.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline">
                                {task.dueDate
                                  ? format(task.dueDate, "PP")
                                  : "Set due date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={task.dueDate || undefined}
                                onSelect={(date) =>
                                  updateTaskDueDate(task.id, date)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </div>
  );
}
