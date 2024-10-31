"use client";

import { useEffect, useState } from "react";

interface DeveloperProfile {
  is_developer: boolean;
  job_title: string;
  years_of_experience: number;
  skills: string[];
  available_date: string | null;
  user?: {
    first_name: string;
    last_name: string;
  };
}

interface DevelopersData {
  assigned_developers: DeveloperProfile[];
  available_developers: DeveloperProfile[];
}

export default function DevelopersPage() {
  const [developersData, setDevelopersData] = useState<DevelopersData>({
    assigned_developers: [],
    available_developers: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/developers/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch developers data.");
        }

        const data = await response.json();
        setDevelopersData(data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      }
    };

    fetchDevelopers();
  }, []);

  return (
    <div className="container mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {error ? (
        <div className="col-span-2 text-red-500 text-center">{error}</div>
      ) : (
        <>
          <div className="p-4 bg-white border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Assigned Developers</h2>
            {developersData.assigned_developers.length > 0 ? (
              developersData.assigned_developers.map((dev, index) => (
                <div key={index} className="mb-4">
                  {dev.user ? (
                    <>
                      <p>
                        <strong>
                          {dev.user.first_name} {dev.user.last_name}
                        </strong>
                      </p>
                      <p>Job Title: {dev.job_title || "N/A"}</p>
                      <p>
                        Skills:{" "}
                        {dev.skills.length > 0 ? dev.skills.join(", ") : "N/A"}
                      </p>
                      <p>Available Date: {dev.available_date || "N/A"}</p>
                    </>
                  ) : (
                    <p>No user information available</p>
                  )}
                </div>
              ))
            ) : (
              <p>No developers assigned to projects.</p>
            )}
          </div>

          <div className="p-4 bg-white border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Available Developers</h2>
            {developersData.available_developers.length > 0 ? (
              developersData.available_developers.map((dev, index) => (
                <div key={index} className="mb-4">
                  {dev.user ? (
                    <>
                      <p>
                        <strong>
                          {dev.user.first_name} {dev.user.last_name}
                        </strong>
                      </p>
                      <p>Job Title: {dev.job_title || "N/A"}</p>
                      <p>
                        Skills:{" "}
                        {dev.skills.length > 0 ? dev.skills.join(", ") : "N/A"}
                      </p>
                      <p>Available Date: {dev.available_date || "N/A"}</p>
                    </>
                  ) : (
                    <p>No user information available</p>
                  )}
                </div>
              ))
            ) : (
              <p>No developers available for work requests.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
