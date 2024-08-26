"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import {
  LayoutDashboard,
  CalendarCheck,
  Search,
  Star,
  Folder,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface SearchModalProps extends DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  favoriteProjects: Project[];
}

interface Project {
  id: string;
  name: string;
  color: string;
}

export function SearchModal({
  open,
  onOpenChange,
  projects,
  favoriteProjects,
  ...props
}: SearchModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange],
  );

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [projects, searchTerm]);

  const filteredFavoriteProjects = React.useMemo(() => {
    return favoriteProjects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [favoriteProjects, searchTerm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 dark:[&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
              placeholder="Type to search..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandPrimitive.List className="max-h-[300px] overflow-y-auto">
            <CommandPrimitive.Empty>No results found.</CommandPrimitive.Empty>
            <CommandPrimitive.Group heading="Suggestions">
              <CommandPrimitive.Item
                onSelect={() => runCommand(() => router.push("/dashboard"))}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandPrimitive.Item>
              <CommandPrimitive.Item
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/today"))
                }
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                <span>Today</span>
              </CommandPrimitive.Item>
            </CommandPrimitive.Group>
            {filteredFavoriteProjects.length > 0 && (
              <CommandPrimitive.Group heading="Favorite Projects">
                {filteredFavoriteProjects.map((project) => (
                  <CommandPrimitive.Item
                    key={project.id}
                    onSelect={() =>
                      runCommand(() =>
                        router.push(`/dashboard/projects/${project.id}`),
                      )
                    }
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: project.color }}
                      />
                      <Star className="mr-2 h-4 w-4 text-yellow-400" />
                      <span>{project.name}</span>
                    </div>
                  </CommandPrimitive.Item>
                ))}
              </CommandPrimitive.Group>
            )}
            {filteredProjects.length > 0 && (
              <CommandPrimitive.Group heading="Projects">
                {filteredProjects.map((project) => (
                  <CommandPrimitive.Item
                    key={project.id}
                    onSelect={() =>
                      runCommand(() =>
                        router.push(`/dashboard/projects/${project.id}`),
                      )
                    }
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: project.color }}
                      />
                      <Folder className="mr-2 h-4 w-4" />
                      <span>{project.name}</span>
                    </div>
                  </CommandPrimitive.Item>
                ))}
              </CommandPrimitive.Group>
            )}
          </CommandPrimitive.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
