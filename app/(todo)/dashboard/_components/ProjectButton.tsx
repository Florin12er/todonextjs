import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";

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
    <Link href={`/dashboard/projects/${project.id}`} passHref>
      <Button
        variant="transparent"
        size="sm"
        className="w-full justify-start"
        asChild
      >
        <div className="flex items-center w-full">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: project.color }}
          />
          <span className="flex-grow">{project.name}</span>
        </div>
      </Button>
    </Link>
  );
}
