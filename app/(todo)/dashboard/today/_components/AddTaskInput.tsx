import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";

type AddTaskInputProps = {
  onAddTask: (title: string) => void;
};

export function AddTaskInput({ onAddTask }: AddTaskInputProps) {
  const [title, setTitle] = useState("");

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title.trim() !== "") {
      onAddTask(title.trim());
      setTitle("");
    }
  };

  return (
    <Input
      type="text"
      placeholder="Add a new task"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyPress={handleKeyPress}
      className="mt-2"
    />
  );
}
