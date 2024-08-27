// ProjectsList.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch("/api/projects");
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
};

export function ProjectsList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    refetchInterval: 30000, // Refetch every 30 seconds as a fallback
  });

  const addProjectMutation = useMutation<Project, Error, Omit<Project, "id">>({
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
      toast({ title: "Success", description: "Project created successfully." });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddProject = async (newProject: Omit<Project, "id">) => {
    addProjectMutation.mutate(newProject);
  };

  if (isLoading) return <Spinner size={20} />;
  if (error) return <div>Error loading projects</div>;

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
              ?.filter((p) => p.isFavorite)
              .map((project) => (
                <ProjectButton key={project.id} project={project} />
              ))}
          </div>
          <div className="ml-4 space-y-1">
            {projects
              ?.filter((p) => !p.isFavorite)
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
