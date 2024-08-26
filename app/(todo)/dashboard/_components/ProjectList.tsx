"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddProjectModal } from "./AddProjectModal";
import { ProjectButton } from "./ProjectButton";

// Mock projects
const mockProjects = [
  {
    id: "1",
    name: "Personal",
    color: "#FF5733",
    isFavorite: true,
    design: "LIST",
  },
  {
    id: "2",
    name: "Work",
    color: "#33FF57",
    isFavorite: false,
    design: "BOARD",
  },
  {
    id: "3",
    name: "Side Project",
    color: "#3357FF",
    isFavorite: false,
    design: "LIST",
  },
];

export function ProjectsList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projects, setProjects] = useState(mockProjects);

  const handleAddProject = (newProject) => {
    // TODO: Implement project creation logic here
    console.log("Creating project:", newProject);
    // For now, let's just add it to the local state
    setProjects([...projects, { ...newProject, id: Date.now().toString() }]);
  };

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
