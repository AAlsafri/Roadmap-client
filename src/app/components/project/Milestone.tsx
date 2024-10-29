"use client";

import { Milestone } from "@/types/milestone.types";

interface MilestoneProps {
  milestone: Milestone;
}

const MilestoneComponent: React.FC<MilestoneProps> = ({ milestone }) => {
  return (
    <div className="p-3 my-2 border border-gray-200 rounded">
      <h4 className="font-semibold">{milestone.name}</h4>
      <p>Status: {milestone.status}</p>
      <p>Due Date: {milestone.due_date}</p>
    </div>
  );
};

export default MilestoneComponent;
