// app/(todo)/dashboard/_components/ProjectDashboard.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Folder, Star, Trash2 } from "lucide-react";
import { AddProjectModal } from "./AddProjectModal";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/Spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Task = {
  id: string;
  completed: boolean;
};

type Project = {
  id: string;
  name: string;
  color: string;
  tasks?: Task[];
  isFavorite: boolean;
  design: "LIST" | "BOARD";
};

type NewProject = Omit<Project, "id" | "tasks">;

const fetchProjects = async (): Promise<Project[]> => {
  const [regularResponse, favoriteResponse] = await Promise.all([
    fetch("/api/projects"),
    fetch("/api/projects/favorite"),
  ]);

  if (!regularResponse.ok || !favoriteResponse.ok) {
    throw new Error("Failed to fetch projects");
  }

  const regularData: Project[] = await regularResponse.json();
  const favoriteData: Project[] = await favoriteResponse.json();

  return [
    ...favoriteData.map((p) => ({ ...p, isFavorite: true })),
    ...regularData
      .filter((p) => !favoriteData.some((f) => f.id === p.id))
      .map((p) => ({ ...p, isFavorite: false })),
  ];
};

export function ProjectDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const queryClient = useQueryClient();

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const addProjectMutation = useMutation<Project, Error, NewProject>({
    mutationFn: (newProject) =>
      fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to create project");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
      toast({ title: "Success", description: "Project created successfully." });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation<void, Error, string>({
    mutationFn: (projectId) =>
      fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to delete project");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Success", description: "Project deleted successfully." });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddProject = async (newProject: NewProject): Promise<void> => {
    try {
      await addProjectMutation.mutateAsync(newProject);
    } catch (error) {
      console.error("Error in handleAddProject:", error);
    }
  };

  const handleDeleteProject = async (projectId: string): Promise<void> => {
    try {
      await deleteProjectMutation.mutateAsync(projectId);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Error in handleDeleteProject:", error);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects Dashboard</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => {
          const tasksCompleted =
            project.tasks?.filter((task) => task.completed).length ?? 0;
          const totalTasks = project.tasks?.length ?? 0;

          return (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Folder
                    className="w-4 h-4 inline-block mr-2"
                    style={{ color: project.color }}
                  />
                  {project.name}
                  {project.isFavorite && (
                    <Star className="w-4 h-4 ml-2 text-yellow-400 fill-current" />
                  )}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProjectToDelete(project)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <div className="text-2xl font-bold">
                    {tasksCompleted} / {totalTasks}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tasks completed
                  </p>
                  <Progress
                    value={
                      totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0
                    }
                    className="mt-2"
                  />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddProject={handleAddProject}
      />

      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={() => setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all its tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                projectToDelete && handleDeleteProject(projectToDelete.id)
              }
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
