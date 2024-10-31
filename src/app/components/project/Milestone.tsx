"use client";

import { useState } from "react";
import { Milestone } from "@/types/milestone.types";

interface MilestoneProps {
  milestone: Milestone;
  onStatusChange: (
    milestoneId: number,
    newStatus: "open" | "completed" | "pending"
  ) => void;
  isEditable: boolean; // New prop for edit access
}

const MilestoneComponent: React.FC<MilestoneProps> = ({
  milestone,
  onStatusChange,
  isEditable,
}) => {
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.value as "open" | "completed" | "pending";
    onStatusChange(milestone.id, newStatus);
  };

  return (
    <div className="p-3 my-2 border border-gray-200 rounded">
      <h4 className="font-semibold">{milestone.name}</h4>
      <p>Status: {milestone.status}</p>
      <p>Due Date: {milestone.due_date}</p>

      {isEditable ? (
        <div className="flex space-x-2">
          {["pending", "open", "completed"].map((status) => (
            <label key={status}>
              <input
                type="radio"
                value={status}
                checked={milestone.status === status}
                onChange={handleStatusChange}
              />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </label>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          Status is view-only for non-assigned users.
        </p>
      )}
    </div>
  );
};

export default MilestoneComponent;
