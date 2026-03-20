"use client";

import { useState } from "react";
import SuperAdminSideBar from "../DashboardLayoutPerRole/SuperAdminSideBar";
import Search from "../Search";
import NavBar from "../DashboardLayoutPerRole/NavBar";
//import NewEntry from "../NewEntry";
import Agencies from "../Agencies";
import Companies from "../Companies";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1">
        <SuperAdminSideBar onSelectTab={setActiveTab} activeTab={activeTab} />
        <main className="flex-1 p-6">
          {activeTab === "home" && 
            <div className="space-y-16" >
              <p>Dashboard</p>
              <p>Welcome to the Super Admin Dashboard!</p>
            </div>
          }
          {activeTab === "search" && <Search />}
          {/* {activeTab === "newEntry" && <NewEntry />} */}
          {activeTab === "agencies" && <Agencies />}
          {activeTab === "companies" && <Companies />}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
