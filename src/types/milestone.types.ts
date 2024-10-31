export interface Milestone {
  id: number;
  name: string;
  due_date: string;
  status: "open" | "completed" | "pending";
  project_id: number;
}

export interface MilestoneProps {
  milestone: Milestone;
  onStatusChange: (
    milestoneId: number,
    newStatus: "open" | "completed" | "pending"
  ) => void;
  isEditable: boolean;
}
