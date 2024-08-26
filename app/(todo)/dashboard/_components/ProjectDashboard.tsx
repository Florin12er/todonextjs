// app/(todo)/dashboard/_components/ProjectDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Folder } from "lucide-react";
import { AddProjectModal } from "./AddProjectModal";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/Spinner";

type Task = {
  id: string;
  completed: boolean;
};

type Project = {
  id: string;
  name: string;
  color: string;
  tasks?: Task[];
};

export function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (
    newProject: Omit<Project, "id" | "tasks">,
  ) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const createdProject = await response.json();
      setProjects([...projects, createdProject]);
      setIsModalOpen(false);
      toast({
        title: "Success",
        description: "Project created successfully.",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects Dashboard</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const tasksCompleted =
            project.tasks?.filter((task) => task.completed).length ?? 0;
          const totalTasks = project.tasks?.length ?? 0;

          return (
            <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <Folder
                      className="w-4 h-4 inline-block mr-2"
                      style={{ color: project.color }}
                    />
                    {project.name}
                  </CardTitle>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddProject={handleAddProject}
      />
    </div>
  );
}
