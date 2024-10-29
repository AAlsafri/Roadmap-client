"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types/project.types";
import { UserProfile } from "@/types/user.types";

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
      const response = await fetch(
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

      if (response.ok) {
        onSave(); // Refresh the project list
      } else {
        console.error("Failed to update project");
      }
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
