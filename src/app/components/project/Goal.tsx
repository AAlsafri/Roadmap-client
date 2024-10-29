"use client";

import { useState } from "react";
import { Goal } from "@/types/goal.types";

interface GoalProps {
  goal: Goal;
}

const GoalComponent: React.FC<GoalProps> = ({ goal }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-3 my-2 border border-gray-200 rounded">
      <h4
        className="font-semibold cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {goal.name}
      </h4>
      {isExpanded && (
        <div className="mt-2">
          <p>Description: {goal.description || "No description available"}</p>
          <p>Deadline: {goal.deadline}</p>
        </div>
      )}
    </div>
  );
};

export default GoalComponent;
