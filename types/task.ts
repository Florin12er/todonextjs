// types.ts or types/index.ts
export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date | null;
  completed: boolean;
  isToday: boolean;
  columnId: string | null;
  projectId: string | null;
};
export type Column = {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  color: string;
  isFavorite: boolean;
  design: "LIST" | "BOARD";
  columns: Column[];
};
