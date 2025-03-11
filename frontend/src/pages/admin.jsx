"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Admin/Sidebar";
import Dashboard from "@/components/Admin/Dashboard";
import ManageLocations from "@/components/Admin/ManageLocations";
import ManageUsers from "@/components/Admin/ManageUsers";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      router.push("/"); // Redirect if not an admin
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="w-full p-6">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "manage-locations" && <ManageLocations />}
        {activeTab === "manage-users" && <ManageUsers />}
      </div>
    </div>
  );
}
