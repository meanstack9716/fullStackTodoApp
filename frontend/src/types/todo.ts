export interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
  priority: "Extreme" | "Moderate" | "Low";
  completed: boolean;
  expireAt?: string;
  status: "Pending" | "Completed" | "Expired";
  createdAt: string;
  updatedAt: string;
}

export interface TodoList {
  todos: Todo[];
  currentPage: number;
  totalPage: number;
  totalTodos: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateTodoData {
  title: string;
  description: string;
  date: string;
  priority: "Extreme" | "Moderate" | "Low";
  expireAt?: string;
  completed?: boolean;
  status?: "Pending" | "Completed" | "Expired";
}