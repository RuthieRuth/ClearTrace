"use client";

import { useState } from "react";
import AgencySidebar from "../DashboardLayoutPerRole/AgencySidebar";
import Search from "../Search";
import NavBar from "../DashboardLayoutPerRole/NavBar";

const AgencyDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1">
        <AgencySidebar onSelectTab={setActiveTab} activeTab={activeTab} />
        <main className="flex-1 p-6">
          {activeTab === "search" && <Search />}
        </main>
      </div>
    </div>
  );
};

export default AgencyDashboard;


