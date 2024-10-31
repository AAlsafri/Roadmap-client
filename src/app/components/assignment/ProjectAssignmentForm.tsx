import { useEffect, useState } from "react";
import { DeveloperProfile } from "@/types/user.types";

export default function ProjectAssignmentForm() {
  const [availableDevelopers, setAvailableDevelopers] = useState<
    DeveloperProfile[]
  >([]);

  useEffect(() => {
    const fetchAvailableDevelopers = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/available-developers/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      setAvailableDevelopers(data);
    };
    fetchAvailableDevelopers();
  }, []);

  return (
    <div>
      {availableDevelopers.map((dev) => (
        <div key={dev.user.id} className="p-2 border-b">
          <input type="checkbox" id={`dev-${dev.user.id}`} />
          <label htmlFor={`dev-${dev.user.id}`} className="ml-2">
            {dev.user.first_name} {dev.user.last_name} - {dev.job_title}
            <p className="ml-4">Skills: {dev.skills.join(", ")}</p>
            <p className="ml-4">Available from: {dev.available_date}</p>
          </label>
        </div>
      ))}
    </div>
  );
}
