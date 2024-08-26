// AddProjectModal.tsx
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
import { toast } from "@/components/ui/use-toast";

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
    design: "LIST" | "BOARD";
  }) => Promise<void>;
};

export function AddProjectModal({
  isOpen,
  onOpenChange,
  onAddProject,
}: AddProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [projectColor, setProjectColor] = useState("#808080");
  const [isFavorite, setIsFavorite] = useState(false);
  const [projectDesign, setProjectDesign] = useState<"LIST" | "BOARD">("LIST");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await onAddProject({
        name: projectName,
        color: projectColor,
        isFavorite,
        design: projectDesign,
      });
      toast({
        title: "Success",
        description: "Project created successfully.",
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              required
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
            <Select
              value={projectDesign}
              onValueChange={(value: "LIST" | "BOARD") =>
                setProjectDesign(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a design" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LIST">List</SelectItem>
                <SelectItem value="BOARD">Board</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
