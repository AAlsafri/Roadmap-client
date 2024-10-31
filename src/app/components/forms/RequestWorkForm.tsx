"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestWorkForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number | "">("");
  const [skills, setSkills] = useState<string[]>([]);
  const [availableDate, setAvailableDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/request-work/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          is_developer: true,
          job_title: jobTitle,
          years_of_experience: yearsOfExperience,
          skills,
          available_date: availableDate,
        }),
      });

      if (response.ok) {
        alert("Work request submitted successfully!");
        router.push("/dashboard");
      } else {
        alert("Failed to submit work request.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
      />
      <input
        type="number"
        placeholder="Years of Experience"
        value={yearsOfExperience}
        onChange={(e) => setYearsOfExperience(Number(e.target.value))}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
      />
      <input
        type="text"
        placeholder="Skills (comma-separated)"
        onChange={(e) =>
          setSkills(e.target.value.split(",").map((s) => s.trim()))
        }
        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
      />
      <input
        type="date"
        value={availableDate}
        onChange={(e) => setAvailableDate(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Submit Work Request
      </button>
    </form>
  );
}
