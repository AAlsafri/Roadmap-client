"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddProjectForm from "../components/forms/Project";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect to login if user is not authenticated
    } else {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/projects", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleProjectAdded = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>
            Welcome, {user.first_name} {user.last_name}
          </p>
          <button onClick={handleLogout}>Logout</button>

          <AddProjectForm onProjectAdded={handleProjectAdded} />

          <h2>Your Projects</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
