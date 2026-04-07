"use client";

import { useState } from "react";
import GovtSidebar from "../DashboardLayoutPerRole/GovtSidebar";
import Search from "../Search";
import NavBar from "../DashboardLayoutPerRole/NavBar";
import NewPerson from "../NewPerson";

const GovtDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1">
        <GovtSidebar onSelectTab={setActiveTab} activeTab={activeTab} />
        <main className="flex-1 p-6">
          {activeTab === "home" && 
            <div className="space-y-16" >
              <p>Dashboard</p>
              <p>Welcome to the Super Admin Dashboard!</p>
            </div>
          }
          {activeTab === "search" && <Search />}
          {activeTab === "newPerson" && <NewPerson/>}
        </main>
      </div>
    </div>
  );
};

export default GovtDashboard;


