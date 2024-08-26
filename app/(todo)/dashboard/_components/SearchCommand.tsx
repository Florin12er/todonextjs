"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchModal } from "./SearchModal";
import { toast } from "@/components/ui/use-toast";

type Project = {
  id: string;
  name: string;
  color: string;
};

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [favoriteProjects, setFavoriteProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const [projectsResponse, favoriteProjectsResponse] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/projects/favorite"),
        ]);

        if (!projectsResponse.ok || !favoriteProjectsResponse.ok) {
          throw new Error("Failed to fetch projects");
        }

        const projectsData = await projectsResponse.json();
        const favoriteProjectsData = await favoriteProjectsResponse.json();

        setProjects(projectsData);
        setFavoriteProjects(favoriteProjectsData);
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

    fetchProjects();
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        className="relative w-full justify-start text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border border-gray-600 bg-gray-700 px-1.5 font-mono text-[10px] font-medium text-gray-400 opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <SearchModal
        projects={projects}
        favoriteProjects={favoriteProjects}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
