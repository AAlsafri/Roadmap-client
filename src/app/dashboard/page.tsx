"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddProjectForm from "../components/forms/Project";
import { Project } from "@/types/project.types";
import { UserProfile } from "@/types/user.types";
import EditProjectForm from "../components/forms/EditProject";

interface ExpandedProject extends Project {
  isExpanded?: boolean;
  isEditing?: boolean;
  assigned_users: UserProfile[];
}

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<ExpandedProject[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchProjects();
      }
    }
  }, [user, isLoading]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/projects", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data: Project[] = await response.json();
        setProjects(
          data.map((project) => ({
            ...project,
            assigned_users: project.assigned_users || [],
            isExpanded: false,
          }))
        );
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleProjectAdded = () => {
    fetchProjects();
    setShowForm(false);
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        fetchProjects();
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEditToggle = (projectId: number) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, isEditing: !project.isEditing }
          : project
      )
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const toggleProjectExpand = (projectId: number) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, isExpanded: !project.isExpanded }
          : project
      )
    );
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      {isLoading ? (
        <p className="text-center text-xl">Loading...</p>
      ) : user ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">
              Welcome, {user.first_name} {user.last_name}
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
          >
            {showForm ? "Cancel" : "New Project"}
          </button>

          {showForm && (
            <div className="mt-4">
              <AddProjectForm onProjectAdded={handleProjectAdded} />
            </div>
          )}

          <h2 className="text-2xl font-semibold mt-8">Your Projects</h2>
          <ul className="space-y-4">
            {projects.map((project) => (
              <li
                key={project.id}
                className="p-4 bg-gray-100 border border-gray-300 rounded-lg"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleProjectExpand(project.id)}
                >
                  <p className="text-lg font-medium">{project.name}</p>
                  <span className="text-sm text-gray-600">
                    {project.assigned_users.length || 0} Users Assigned
                  </span>
                </div>
                {project.isExpanded && (
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-700">{project.description}</p>
                    <h3 className="text-md font-semibold">Assigned Users:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {project.assigned_users.length > 0 ? (
                        project.assigned_users.map((assignedUser) => (
                          <li key={assignedUser.id}>
                            {assignedUser.first_name} {assignedUser.last_name} (
                            {assignedUser.username})
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500">No users assigned</li>
                      )}
                    </ul>

                    {project.isEditing ? (
                      <EditProjectForm
                        project={project}
                        onCancel={() => handleEditToggle(project.id)}
                        onSave={fetchProjects} // Refresh projects after saving
                      />
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditToggle(project.id);
                        }}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mt-2"
                      >
                        Edit Project
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-2"
                    >
                      Delete Project
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-xl">
          You are not authorized to view this page.
        </p>
      )}
    </div>
  );
}
