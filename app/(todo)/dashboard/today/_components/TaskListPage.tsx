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

type Task = {
  id: number;
  title: string;
  status: string;
  dueDate: Date;
};

type TaskListPageProps = {
  initialTasks?: Task[];
  onAddTask?: (task: Omit<Task, "id">) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
};

export function TaskListPage({
  initialTasks = [],
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
    if (newTaskTitle.trim() !== "") {
      const newTask = {
        title: newTaskTitle,
        status: "Todo",
        dueDate: new Date(),
      };
      if (onAddTask) {
        onAddTask(newTask);
      } else {
        setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
      }
      setNewTaskTitle("");
    }
  };

  const removeTask = (id: number) => {
    if (onDeleteTask) {
      onDeleteTask(id);
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const updateTaskStatus = (id: number, newStatus: string) => {
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask) {
      const newTask = { ...updatedTask, status: newStatus };
      if (onUpdateTask) {
        onUpdateTask(newTask);
      } else {
        setTasks(tasks.map((task) => (task.id === id ? newTask : task)));
      }
    }
  };

  const updateTaskDueDate = (id: number, newDate: Date) => {
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask) {
      const newTask = { ...updatedTask, dueDate: newDate };
      if (onUpdateTask) {
        onUpdateTask(newTask);
      } else {
        setTasks(tasks.map((task) => (task.id === id ? newTask : task)));
      }
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

    if (onUpdateTask) {
      newTasks.forEach((task, index) => {
        if (task.id !== tasks[index].id) {
          onUpdateTask(task);
        }
      });
    }
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
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TableCell>{task.title}</TableCell>
                        <TableCell>
                          <Select
                            value={task.status}
                            onValueChange={(newStatus) =>
                              updateTaskStatus(task.id, newStatus)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Todo">Todo</SelectItem>
                              <SelectItem value="In Progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="Done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline">
                                {format(task.dueDate, "PP")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={task.dueDate}
                                onSelect={(date) =>
                                  date && updateTaskDueDate(task.id, date)
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
