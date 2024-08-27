// types.ts or types/index.ts
export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date | null;
  completed: boolean;
  isToday: boolean;
  projectId: string | null;
  columnId: string | null;
  order?: number;
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
