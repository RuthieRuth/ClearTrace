"use client";

import { useState } from "react";
import AgencySidebar from "../DashboardLayoutPerRole/AgencySidebar";
import Search from "../Search";
import NavBar from "../DashboardLayoutPerRole/NavBar";
import NewPerson from "../NewPerson";

const AgencyDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1">
        <AgencySidebar onSelectTab={setActiveTab} activeTab={activeTab} />
        <main className="flex-1 p-6">
          {activeTab === "home" && 
            <div className="space-y-16" >
              <p> Agency Dashboard</p>
              <p>Welcome to the Agency Dashboard!</p>
            </div>
          }
          {activeTab === "search" && <Search onAddPerson={() => setActiveTab('newPerson')} />}
          {activeTab === "newPerson" && <NewPerson />}
        </main>
      </div>
    </div>
  );
};

export default AgencyDashboard;


