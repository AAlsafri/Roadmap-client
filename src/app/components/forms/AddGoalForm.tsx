"use client";

import { useState } from "react";
import { Project } from "@/types/project.types";

interface AddGoalFormProps {
  projectId: number;
  onGoalAdded: () => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({
  projectId,
  onGoalAdded,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/projects/${projectId}/goals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name,
            description,
            deadline,
          }),
        }
      );

      if (response.ok) {
        onGoalAdded();
        setName("");
        setDescription("");
        setDeadline("");
      } else {
        alert("Failed to add goal");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Goal Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="date"
        placeholder="Deadline"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="w-full p-2 bg-green-500 text-white rounded"
      >
        Add Goal
      </button>
    </form>
  );
};

export default AddGoalForm;
