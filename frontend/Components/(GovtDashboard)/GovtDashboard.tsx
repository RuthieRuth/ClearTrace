"use client";

import { useState } from "react";
import GovtSidebar from "../DashboardLayoutPerRole/GovtSidebar";
import Search from "../Search";
import NavBar from "../DashboardLayoutPerRole/NavBar";
import NewEntry from "../NewPlatfomUser";

const GovtDashboard = () => {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1">
        <GovtSidebar onSelectTab={setActiveTab} activeTab={activeTab} />
        <main className="flex-1 p-6">
          {activeTab === "search" && <Search />}
          {activeTab === "newEntry" && <NewEntry />}
        </main>
      </div>
    </div>
  );
};

export default GovtDashboard;
