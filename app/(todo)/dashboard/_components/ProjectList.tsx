"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const colorOptions = [
  { value: "#FF5733", label: "Red" },
  { value: "#33FF57", label: "Green" },
  { value: "#3357FF", label: "Blue" },
  { value: "#FFFF33", label: "Yellow" },
  { value: "#FF33FF", label: "Purple" },
];

export function ProjectsList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectColor, setProjectColor] = useState("#808080");
  const [isFavorite, setIsFavorite] = useState(false);
  const [projectDesign, setProjectDesign] = useState("LIST");

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement project creation logic here
    console.log("Creating project:", {
      projectName,
      projectColor,
      isFavorite,
      projectDesign,
    });
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setProjectName("");
    setProjectColor("#808080");
    setIsFavorite(false);
    setProjectDesign("LIST");
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="transparent" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectColor">Project Color</Label>
                <Select value={projectColor} onValueChange={setProjectColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="favorite"
                  checked={isFavorite}
                  onCheckedChange={setIsFavorite}
                />
                <Label htmlFor="favorite">Favorite</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDesign">Project Design</Label>
                <Select value={projectDesign} onValueChange={setProjectDesign}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a design" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LIST">List</SelectItem>
                    <SelectItem value="BOARD">Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Create Project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {!isCollapsed && (
        <>
          <div className="ml-4 space-y-1">
            {mockProjects
              .filter((p) => p.isFavorite)
              .map((project) => (
                <ProjectButton key={project.id} project={project} />
              ))}
          </div>
          <div className="ml-4 space-y-1">
            {mockProjects
              .filter((p) => !p.isFavorite)
              .map((project) => (
                <ProjectButton key={project.id} project={project} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectButton({ project }) {
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
