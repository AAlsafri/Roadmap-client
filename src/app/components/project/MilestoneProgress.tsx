"use client";

import { Milestone } from "@/types/milestone.types";

interface MilestoneProgressProps {
  milestones: Milestone[];
}

const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
  milestones,
}) => {
  const calculateProgress = () => {
    let progress = 0;
    milestones.forEach((milestone) => {
      if (milestone.status === "completed") {
        switch (milestone.name.toLowerCase()) {
          case "planning":
            progress += 25;
            break;
          case "prototype":
            progress += 25;
            break;
          case "alpha":
            progress += 25;
            break;
          case "beta":
            progress += 12.5;
            break;
          case "release":
            progress += 12.5;
            break;
          default:
            break;
        }
      }
    });
    return progress;
  };

  const progress = calculateProgress();

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Project Progress</h3>
      <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
        <div
          className="h-full bg-green-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm mt-1">{progress.toFixed(0)}% Complete</p>
    </div>
  );
};

export default MilestoneProgress;
