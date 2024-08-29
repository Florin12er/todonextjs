"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TaskBoardPage } from "../../_components/TaskBoardPage";
import { TaskListPage } from "../../_components/TaskListPage";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/Spinner";
import { Task, Column, Project } from "@/types/task";
import { List, LayoutGrid } from "lucide-react";

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"list" | "board">("list");

  const fetchProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${params.projectId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      const data = await response.json();
      const updatedColumns: Column[] = data.columns.map((column: Column) => ({
        ...column,
        tasks: Array.isArray(column.tasks)
          ? column.tasks.map((task: Task) => ({
              ...task,
              dueDate: task.dueDate ? new Date(task.dueDate) : null,
            }))
          : [],
      }));
      const transformedProject: Project = {
        ...data,
        columns: updatedColumns,
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
  }, [params.projectId]);
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

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
      const addedTask: Task = await response.json();
      setProject((prev) => {
        if (!prev) return null;
        const updatedColumns = prev.columns.map((column) =>
          column.id === addedTask.columnId
            ? {
                ...column,
                tasks: [...column.tasks, addedTask],
              }
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
      const updated: Task = await response.json();
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
      const updatedTask: Task = await response.json();
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
            return {
              ...column,
              tasks: [...column.tasks, updatedTask],
            };
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

  const handleAddColumn = async (newColumn: Omit<Column, "id" | "tasks">) => {
    try {
      const response = await fetch(
        `/api/projects/${params.projectId}/columns`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newColumn),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to add column");
      }
      const addedColumn: Column = await response.json();
      setProject((prev) =>
        prev
          ? {
              ...prev,
              columns: [...prev.columns, { ...addedColumn, tasks: [] }],
            }
          : null,
      );
      toast({ title: "Success", description: "Column added successfully." });
    } catch (error) {
      console.error("Error adding column:", error);
      toast({
        title: "Error",
        description: "Failed to add column. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateColumn = async (updatedColumn: Column) => {
    try {
      const response = await fetch(
        `/api/projects/${params.projectId}/columns/${updatedColumn.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedColumn),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update column");
      }
      const updated: Column = await response.json();
      setProject((prev) =>
        prev
          ? {
              ...prev,
              columns: prev.columns.map((col) =>
                col.id === updated.id ? { ...updated, tasks: col.tasks } : col,
              ),
            }
          : null,
      );
      toast({ title: "Success", description: "Column updated successfully." });
    } catch (error) {
      console.error("Error updating column:", error);
      toast({
        title: "Error",
        description: "Failed to update column. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    try {
      const response = await fetch(
        `/api/projects/${params.projectId}/columns/${columnId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete column");
      }
      setProject((prev) =>
        prev
          ? {
              ...prev,
              columns: prev.columns.filter((col) => col.id !== columnId),
            }
          : null,
      );
      toast({ title: "Success", description: "Column deleted successfully." });
    } catch (error) {
      console.error("Error deleting column:", error);
      toast({
        title: "Error",
        description: "Failed to delete column. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={20} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-semibold text-gray-600">
          Project not found
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold" style={{ color: project.color }}>
            {project.name}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4 mr-2" />
            List View
          </Button>
          <Button
            variant={view === "board" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("board")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Board View
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <TaskListPage
          tasks={project.columns.flatMap((column) => column.tasks)}
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
          onAddColumn={handleAddColumn}
          onUpdateColumn={handleUpdateColumn}
          onDeleteColumn={handleDeleteColumn}
        />
      )}
    </div>
  );
}
