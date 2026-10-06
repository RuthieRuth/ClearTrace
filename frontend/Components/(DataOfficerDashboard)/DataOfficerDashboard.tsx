"use client";

import { useState } from "react";
import DataOfficerSidebar from "../DashboardLayoutPerRole/DataOfficerSidebar";
import Search from "../Search";
import NavBar from "../DashboardLayoutPerRole/NavBar";
import NewPerson from "../NewPerson";
import DataHistory from "../RequestDataHistory";

const DataOfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1">
        <DataOfficerSidebar onSelectTab={setActiveTab} activeTab={activeTab} />

        <main className="flex-1 p-6">
          {activeTab === "home" && (
            <div className="space-y-16">
              <p> Data Officer Dashboard</p>
              <p>Welcome to the Data Officer Dashboard!</p>
            </div>
          )}
          {activeTab === "newPerson" && <NewPerson />}
          {activeTab === "search" && (
            <Search onAddPerson={() => setActiveTab("newPerson")} />
          )}
          {activeTab === "history" && <DataHistory />}
        </main>
      </div>
    </div>
  );
};

export default DataOfficerDashboard;
