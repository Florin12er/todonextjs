"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock favorite projects (in a real app, you'd fetch this from your API)
const mockFavoriteProjects = [
  { id: "1", name: "Personal", color: "#FF5733" },
  { id: "4", name: "Hobby", color: "#33FFFF" },
];

export function FavoriteProjectsList() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          {mockFavoriteProjects.map((project) => (
            <FavoriteProjectButton key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function FavoriteProjectButton({ project }) {
  return (
    <Button variant="transparent" size="sm" className="w-full justify-start">
      <div className="flex items-center w-full">
        <div
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: project.color }}
        />
        <Folder className="mr-2 h-4 w-4" />
        <span className="flex-grow">{project.name}</span>
      </div>
    </Button>
  );
}
