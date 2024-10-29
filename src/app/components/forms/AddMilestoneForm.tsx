"use client";

import { useState } from "react";
import { Project } from "@/types/project.types";

interface AddMilestoneFormProps {
  projectId: number;
  onMilestoneAdded: () => void;
}

const AddMilestoneForm: React.FC<AddMilestoneFormProps> = ({
  projectId,
  onMilestoneAdded,
}) => {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("open");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/projects/${projectId}/milestones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name,
            due_date: dueDate,
            status,
          }),
        }
      );

      if (response.ok) {
        onMilestoneAdded();
        setName("");
        setDueDate("");
        setStatus("open");
      } else {
        alert("Failed to add milestone");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Milestone Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="date"
        placeholder="Due Date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="open">Open</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Add Milestone
      </button>
    </form>
  );
};

export default AddMilestoneForm;
