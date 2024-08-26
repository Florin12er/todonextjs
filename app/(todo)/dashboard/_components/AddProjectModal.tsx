"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

const colorOptions = [
  { value: "#FF5733", label: "Red" },
  { value: "#33FF57", label: "Green" },
  { value: "#3357FF", label: "Blue" },
  { value: "#FFFF33", label: "Yellow" },
  { value: "#FF33FF", label: "Purple" },
];

type AddProjectModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProject: (project: {
    name: string;
    color: string;
    isFavorite: boolean;
    design: string;
  }) => void;
};

export function AddProjectModal({
  isOpen,
  onOpenChange,
  onAddProject,
}: AddProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [projectColor, setProjectColor] = useState("#808080");
  const [isFavorite, setIsFavorite] = useState(false);
  const [projectDesign, setProjectDesign] = useState("LIST");

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject({
      name: projectName,
      color: projectColor,
      isFavorite,
      design: projectDesign,
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setProjectName("");
    setProjectColor("#808080");
    setIsFavorite(false);
    setProjectDesign("LIST");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
}
