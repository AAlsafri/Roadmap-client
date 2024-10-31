"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types/project.types";
import { Milestone } from "@/types/milestone.types";

interface User {
  id: number;
  username: string;
}

interface AddProjectFormProps {
  onProjectAdded: (project: Project) => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onProjectAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Step 1: Create the project
      const projectResponse = await fetch("http://localhost:8000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          description,
          assigned_users: assignedUserIds,
        }),
      });

      if (projectResponse.ok) {
        const newProject: Project = await projectResponse.json();

        // Step 2: Add milestones for the new project, if any
        for (const milestone of milestones) {
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
              project: newProject.id, // Use the newly created project ID
            }),
          });
        }

        // Step 3: Call the onProjectAdded callback and reset form
        onProjectAdded(newProject);
        setName("");
        setDescription("");
        setAssignedUserIds([]);
        setMilestones([]);
      } else {
        alert("Failed to create project");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUserCheckboxChange = (userId: number) => {
    setAssignedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { id: Date.now(), name: "", due_date: "", status: "open", project_id: 0 },
    ]);
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create a New Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block font-medium text-gray-700">
            Assign Users:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {users.map((user) => (
              <label key={user.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={assignedUserIds.includes(user.id)}
                  onChange={() => handleUserCheckboxChange(user.id)}
                />
                <span>{user.username}</span>
              </label>
            ))}
          </div>

          {/* Milestone Section */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Milestones</h3>
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="border p-2 mt-2 rounded">
                <input
                  type="text"
                  placeholder="Milestone Name"
                  value={milestone.name}
                  onChange={(e) =>
                    handleMilestoneChange(index, "name", e.target.value)
                  }
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="date"
                  value={milestone.due_date}
                  onChange={(e) =>
                    handleMilestoneChange(index, "due_date", e.target.value)
                  }
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
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
            <button
              type="button"
              onClick={handleAddMilestone}
              className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Milestone
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
          >
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectForm;
