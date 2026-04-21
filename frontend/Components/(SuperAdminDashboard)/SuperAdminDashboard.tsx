"use client";

import { useState } from "react";
import SuperAdminSideBar from "../DashboardLayoutPerRole/SuperAdminSideBar";
import Search from "../Search";
import NavBar from "../DashboardLayoutPerRole/NavBar";
//import NewEntry from "../NewEntry";
import Agencies from "../Agencies";
import Companies from "../Companies";
import NewPerson from "../NewPerson";
import RequestLists from "../RequestLists";


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
              <p> Super Admin Dashboard</p>
              <p>Welcome to the Super Admin Dashboard!</p>
            </div>
          }
          {activeTab === "agencies" && <Agencies />}
          {activeTab === "companies" && <Companies onClose={() => setActiveTab('companies')} />}
          {activeTab === "search" && <Search onAddPerson={() => setActiveTab('newPerson')} />}
          {activeTab === "newPerson" && <NewPerson />}
          {activeTab === "requests" && <RequestLists />}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
