"use client";

import { useState } from "react";
import SuperAdminSideBar from "../DashboardLayoutPerRole/SuperAdminSideBar";
import Search from "../Search";
import NavBar from "../DashboardLayoutPerRole/NavBar";
import NewEntry from "../NewEntry";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("landing_page");

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1">
        <SuperAdminSideBar onSelectTab={setActiveTab} activeTab={activeTab} />
        <main className="flex-1 p-6">
          {activeTab === "search" && <Search />}
          {activeTab === "newEntry" && <NewEntry />}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
