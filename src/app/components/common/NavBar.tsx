"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Roadmap
        </Link>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link href="/projects" className="hover:text-gray-300">
                Projects
              </Link>
              <Link href="/milestones" className="hover:text-gray-300">
                Milestones
              </Link>
              <Link href="/goals" className="hover:text-gray-300">
                Goals
              </Link>
              <Link href="/developers" className="hover:text-gray-300">
                Developers
              </Link>
              <Link href="/work-request" className="hover:text-gray-300">
                Work Request
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link href="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
