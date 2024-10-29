export interface Milestone {
  id: number;
  name: string;
  due_date: string;
  status: "open" | "completed" | "pending";
  project_id: number;
}
