import { Button } from "@/components/ui/button";
import { Folder, Star } from "lucide-react";

type ProjectButtonProps = {
  project: {
    id: string;
    name: string;
    color: string;
    isFavorite: boolean;
  };
};

export function ProjectButton({ project }: ProjectButtonProps) {
  return (
    <Button variant="transparent" size="sm" className="w-full justify-start">
      <div className="flex items-center w-full">
        <div
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: project.color }}
        />
        <Folder className="mr-2 h-4 w-4" />
        <span className="flex-grow">{project.name}</span>
        {project.isFavorite && <Star className="h-4 w-4 text-yellow-400" />}
      </div>
    </Button>
  );
}
