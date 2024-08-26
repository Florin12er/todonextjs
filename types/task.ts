type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string | null;
  completed: boolean;
  columnId: string;
};

export default Task;
