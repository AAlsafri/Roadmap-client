"use client";

import { useEffect, useState } from "react";
import { DeveloperProfile } from "@/types/user.types";

interface DeveloperSelectProps {
  onAssign: (developerIds: number[]) => void;
}

const DeveloperSelect: React.FC<DeveloperSelectProps> = ({ onAssign }) => {
  const [availableDevelopers, setAvailableDevelopers] = useState<
    DeveloperProfile[]
  >([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>([]);

  useEffect(() => {
    const fetchAvailableDevelopers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/available-developers/"
        );
        const data = await response.json();
        setAvailableDevelopers(data);
      } catch (error) {
        console.error("Error fetching developers:", error);
      }
    };

    fetchAvailableDevelopers();
  }, []);

  const handleSelectDeveloper = (id: number) => {
    setSelectedDevelopers((prev) =>
      prev.includes(id) ? prev.filter((devId) => devId !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    onAssign(selectedDevelopers);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Available Developers</h3>
      <ul className="list-disc ml-5">
        {availableDevelopers.map((developer) => (
          <li key={developer.user.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedDevelopers.includes(developer.user.id)}
                onChange={() => handleSelectDeveloper(developer.user.id)}
              />
              {developer.user.first_name} - Skills:{" "}
              {developer.skills.join(", ")}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleAssign}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Assign Selected Developers
      </button>
    </div>
  );
};

export default DeveloperSelect;
