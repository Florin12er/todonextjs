"use client";

import { useState } from "react";
import TaskListPage from "./_components/TaskListPage";
import TaskBoardPage from "./_components/TaskBoardPage";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  const [view, setView] = useState<"list" | "board">("list");

  return (
    <div>
      <div className="mb-4 flex justify-end space-x-2">
        <Button
          variant={view === "list" ? "default" : "outline"}
          onClick={() => setView("list")}
        >
          List View
        </Button>
        <Button
          variant={view === "board" ? "default" : "outline"}
          onClick={() => setView("board")}
        >
          Board View
        </Button>
      </div>
      {view === "list" ? <TaskListPage /> : <TaskBoardPage />}
    </div>
  );
}
