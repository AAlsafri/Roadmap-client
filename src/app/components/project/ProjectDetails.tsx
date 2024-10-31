"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/project.types";
import { Goal } from "@/types/goal.types";
import { Milestone } from "@/types/milestone.types";
import MilestoneComponent from "./Milestone";
import GoalComponent from "./Goal";
import MilestoneProgress from "./MilestoneProgress";
import { useAuth } from "@/context/AuthContext";

interface ProjectDetailsProps {
  project: Project & {
    milestones?: Milestone[];
    goals?: Goal[];
  };
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const [milestones, setMilestones] = useState<Milestone[]>(
    project.milestones || []
  );
  const [goals, setGoals] = useState<Goal[]>(project.goals || []);
  const { user: currentUser } = useAuth(); // Get current user from context

  const isProjectOwner = currentUser?.id === project.owner.id;
  const isAssignedDeveloper = project.assigned_users.some(
    (user) => user.id === currentUser?.id
  );

  useEffect(() => {
    if (!milestones.length || !goals.length) {
      fetchProjectDetails();
    }
  }, []);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/projects/${project.id}`
      );
      const data = await response.json();
      setMilestones(data.milestones || []);
      setGoals(data.goals || []);
    } catch (error) {
      console.error("Failed to fetch project details", error);
    }
  };

  const onStatusChange = (
    milestoneId: number,
    newStatus: "open" | "completed" | "pending"
  ) => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, status: newStatus }
          : milestone
      )
    );
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
      <p>{project.description}</p>

      {/* Only show Milestone Progress for Project Owner */}
      {isProjectOwner && <MilestoneProgress milestones={milestones} />}

      <section className="mt-6">
        <h3 className="text-lg font-semibold">Milestones</h3>
        {milestones.map((milestone) => (
          <MilestoneComponent
            key={milestone.id}
            milestone={milestone}
            onStatusChange={onStatusChange}
            isEditable={isAssignedDeveloper && !isProjectOwner}
          />
        ))}
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-semibold">Goals</h3>
        {goals.map((goal) => (
          <GoalComponent key={goal.id} goal={goal} />
        ))}
      </section>
    </div>
  );
};

export default ProjectDetails;
