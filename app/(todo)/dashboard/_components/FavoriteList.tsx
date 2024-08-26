"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";

type Project = {
  id: string;
  name: string;
  color: string;
};

export function FavoriteProjectsList() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavoriteProjects();
  }, []);

  const fetchFavoriteProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects/favorite");
      if (!response.ok) {
        throw new Error("Failed to fetch favorite projects");
      }
      const data = await response.json();
      setFavoriteProjects(data);
    } catch (error) {
      console.error("Error fetching favorite projects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch favorite projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner size={20} />;
  }

  return (
    <div className="space-y-2">
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
        <Star className="mr-2 h-4 w-4 text-yellow-400" />
        Favorites
      </Button>
      {!isCollapsed && (
        <div className="ml-4 space-y-1">
          {favoriteProjects.length > 0 ? (
            favoriteProjects.map((project) => (
              <FavoriteProjectButton key={project.id} project={project} />
            ))
          ) : (
            <div className="text-sm text-gray-500">No favorite projects</div>
          )}
        </div>
      )}
    </div>
  );
}

function FavoriteProjectButton({ project }: { project: Project }) {
  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Button variant="transparent" size="sm" className="w-full justify-start">
        <div className="flex items-center w-full">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: project.color }}
          />
          <Star className="mr-2 h-4 w-4 text-yellow-400" />
          <span className="flex-grow">{project.name}</span>
        </div>
      </Button>
    </Link>
  );
}
