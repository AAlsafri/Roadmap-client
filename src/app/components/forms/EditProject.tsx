"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types/project.types";
import { UserProfile } from "@/types/user.types";
import { Milestone } from "@/types/milestone.types";

interface EditProjectFormProps {
  project: Project;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditProjectForm({
  project,
  onCancel,
  onSave,
}: EditProjectFormProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>(
    project.assigned_users.map((user) => user.id)
  );
  const [milestones, setMilestones] = useState<Milestone[]>(
    project.milestones || []
  );

  useEffect(() => {
    // Fetch all users to allow assigning them to the project
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/users", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSave = async () => {
    try {
      // Step 1: Update the project details
      const projectResponse = await fetch(
        `http://localhost:8000/projects/${project.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name,
            description,
            assigned_users: assignedUserIds,
          }),
        }
      );

      if (!projectResponse.ok) {
        console.error("Failed to update project");
        return;
      }

      // Step 2: Update existing milestones and add new milestones
      for (const milestone of milestones) {
        if (milestone.id) {
          // Update existing milestone
          await fetch(`http://localhost:8000/milestones/${milestone.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              name: milestone.name,
              due_date: milestone.due_date,
              status: milestone.status,
              project: project.id,
            }),
          });
        } else {
          // Create new milestone
          await fetch("http://localhost:8000/milestones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              name: milestone.name,
              due_date: milestone.due_date,
              status: milestone.status,
              project: project.id,
            }),
          });
        }
      }

      onSave(); // Refresh the project list
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleUserToggle = (userId: number) => {
    setAssignedUserIds(
      (prevUserIds) =>
        prevUserIds.includes(userId)
          ? prevUserIds.filter((id) => id !== userId) // Unassign user if already assigned
          : [...prevUserIds, userId] // Assign user if not yet assigned
    );
  };

  const handleMilestoneChange = (
    index: number,
    field: keyof Milestone,
    value: string
  ) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setMilestones(updatedMilestones);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Edit Project</h2>
      <div className="mb-4">
        <label className="block font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Milestone Editing Section */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Milestones</h3>
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="mb-2 p-2 border border-gray-200 rounded"
          >
            <label className="block font-medium">Milestone Name</label>
            <input
              type="text"
              value={milestone.name}
              onChange={(e) =>
                handleMilestoneChange(index, "name", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="block font-medium">Due Date</label>
            <input
              type="date"
              value={milestone.due_date}
              onChange={(e) =>
                handleMilestoneChange(index, "due_date", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="block font-medium">Status</label>
            <select
              value={milestone.status}
              onChange={(e) =>
                handleMilestoneChange(index, "status", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="open">Open</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block font-medium">Assign Users</label>
        <div className="grid grid-cols-2 gap-2">
          {users.map((user) => (
            <label key={user.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={assignedUserIds.includes(user.id)}
                onChange={() => handleUserToggle(user.id)}
                className="form-checkbox"
              />
              <span>
                {user.first_name} {user.last_name} ({user.username})
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}
