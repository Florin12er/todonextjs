// ProjectsList.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddProjectModal } from "./AddProjectModal";
import { ProjectButton } from "./ProjectButton";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/Spinner";

type Project = {
  id: string;
  name: string;
  color: string;
  isFavorite: boolean;
  design: "LIST" | "BOARD";
};

export function ProjectsList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const handleAddProject = async (newProject: Omit<Project, "id">) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      const createdProject = await response.json();
      setProjects([...projects, createdProject]);
      toast({
        title: "Success",
        description: "Project created successfully.",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create project. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw the error so the modal can handle it
    }
  };

  if (isLoading) {
    return <Spinner size={20} />;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Button
          variant="transparent"
          size="sm"
          className="w-full justify-start px-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="mr-2 h-4 w-4" />
          ) : (
            <ChevronDown className="mr-2 h-4 w-4" />
          )}
          Projects
        </Button>
        <Button
          variant="transparent"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {!isCollapsed && (
        <>
          <div className="ml-4 space-y-1">
            {projects
              .filter((p) => p.isFavorite)
              .map((project) => (
                <ProjectButton key={project.id} project={project} />
              ))}
          </div>
          <div className="ml-4 space-y-1">
            {projects
              .filter((p) => !p.isFavorite)
              .map((project) => (
                <ProjectButton key={project.id} project={project} />
              ))}
          </div>
        </>
      )}
      <AddProjectModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onAddProject={handleAddProject}
      />
    </div>
  );
}
