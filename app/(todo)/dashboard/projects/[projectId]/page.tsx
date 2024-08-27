// app/(todo)/dashboard/projects/[projectId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TaskBoardPage } from "../../today/_components/TaskBoardPage";
import { TaskListPage } from "../../today/_components/TaskListPage";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/Spinner";
import { Task, Column, Project } from "@/types/task";

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"list" | "board">("list");

  useEffect(() => {
    fetchProject();
  }, [params.projectId]);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${params.projectId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      const data = await response.json();

      // Transform the data to match your Task type
      const transformedProject: Project = {
        ...data,
        columns: data.columns.map((column: any) => ({
          ...column,
          tasks: column.tasks.map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
          })),
        })),
      };

      setProject(transformedProject);
      setView(data.design.toLowerCase() as "list" | "board");
    } catch (error) {
      console.error("Error fetching project:", error);
      toast({
        title: "Error",
        description: "Failed to fetch project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddTask = async (newTask: Omit<Task, "id">) => {
    try {
      const response = await fetch(`/api/projects/${params.projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      const addedTask = await response.json();
      setProject((prev) => {
        if (!prev) return null;
        const updatedColumns = prev.columns.map((column) =>
          column.id === addedTask.columnId
            ? { ...column, tasks: [...column.tasks, addedTask] }
            : column,
        );
        return { ...prev, columns: updatedColumns };
      });
      toast({ title: "Success", description: "Task added successfully." });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(
        `/api/projects/${params.projectId}/tasks/${updatedTask.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      const updated = await response.json();
      setProject((prev) => {
        if (!prev) return null;
        const updatedColumns = prev.columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === updated.id ? updated : task,
          ),
        }));
        return { ...prev, columns: updatedColumns };
      });
      toast({ title: "Success", description: "Task updated successfully." });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(
        `/api/projects/${params.projectId}/tasks/${taskId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setProject((prev) => {
        if (!prev) return null;
        const updatedColumns = prev.columns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        }));
        return { ...prev, columns: updatedColumns };
      });
      toast({ title: "Success", description: "Task deleted successfully." });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMoveTask = async (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
  ) => {
    try {
      const response = await fetch(
        `/api/projects/${params.projectId}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ columnId: destinationColumnId }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to move task");
      }
      const updatedTask = await response.json();
      setProject((prev) => {
        if (!prev) return null;
        const updatedColumns = prev.columns.map((column) => {
          if (column.id === sourceColumnId) {
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            };
          }
          if (column.id === destinationColumnId) {
            return { ...column, tasks: [...column.tasks, updatedTask] };
          }
          return column;
        });
        return { ...prev, columns: updatedColumns };
      });
      toast({ title: "Success", description: "Task moved successfully." });
    } catch (error) {
      console.error("Error moving task:", error);
      toast({
        title: "Error",
        description: "Failed to move task. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>

      <div className="mb-4 flex justify-end space-x-2">
        <Button
          variant={view === "list" ? "default" : "outline"}
          onClick={() => setView("list")}
        >
          List View
        </Button>
        <Button
          variant={view === "board" ? "default" : "outline"}
          onClick={() => setView("board")}
        >
          Board View
        </Button>
      </div>
      {view === "list" ? (
        <TaskListPage
          initialTasks={project.columns.flatMap((column) => column.tasks)}
          columns={project.columns}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      ) : (
        <TaskBoardPage
          columns={project.columns}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
        />
      )}
    </div>
  );
}
