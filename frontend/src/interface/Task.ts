export interface Task {
  id: number;
  title: string;
  date: string;
  priority: "Extreme" | "Moderate" | "Low";
  description: string;
  completed: boolean;
  status: "Pending" | "In Progress" | "Completed";
}