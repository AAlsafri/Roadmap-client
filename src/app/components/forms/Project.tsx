"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types/project.types";

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
      const response = await fetch("http://localhost:8000/projects", {
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

      if (response.ok) {
        const newProject: Project = await response.json();
        onProjectAdded(newProject);
        setName("");
        setDescription("");
        setAssignedUserIds([]);
      } else {
        alert("Failed to create project");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUserCheckboxChange = (userId: number) => {
    setAssignedUserIds(
      (prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId) // Unassign user
          : [...prev, userId] // Assign user
    );
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

          {/* Display selected users */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Selected Users:</h3>
            {assignedUserIds.length > 0 ? (
              <ul className="list-disc list-inside mt-2 space-y-1">
                {users
                  .filter((user) => assignedUserIds.includes(user.id))
                  .map((user) => (
                    <li key={user.id} className="text-gray-800">
                      {user.username}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500">No users selected</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectForm;
