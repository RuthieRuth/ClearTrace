"use client";

import { useState, useEffect } from "react";
import SuperAdminSideBar from "../DashboardLayoutPerRole/SuperAdminSideBar";
import Search from "../Search";
import NavBar from "../DashboardLayoutPerRole/NavBar";
import Agencies from "../Agencies";
import Companies from "../Companies";
import NewPerson from "../NewPerson";
import RequestLists from "../AdminRequestLists";
import { useAuth } from "@clerk/nextjs";


const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const { getToken } = useAuth();
  const [stats, setStats] = useState({
    persons: 0,
    companies: 0,
    requests: 0,
    users: 0,
    agencyUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = await getToken();

      try {
        const personsStats = await fetch("http://localhost:3000/persons", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await personsStats.json();
        setStats(prev => ({ ...prev, persons: data.length }));
      } catch (error) {
        console.error("Error fetching persons stats:", error);
      }

      try {
        const companiesStats = await fetch("http://localhost:3000/companies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await companiesStats.json();
        setStats(prev => ({ ...prev, companies: data.length }));
      } catch (error) {
        console.error("Error fetching companies stats:", error);
      }

      try {
        const requestsStats = await fetch("http://localhost:3000/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await requestsStats.json();
        setStats(prev => ({ ...prev, requests: data.length }));
      } catch (error) {
        console.error("Error fetching requests stats:", error);
      }

      try {
        const usersStats = await fetch("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await usersStats.json();
        const agencyCount = data.filter(
          (user: {role: string}) => user.role === "agency_head" || user.role === "agency_staff").length;
        setStats(prev => ({ ...prev, users: data.length, agencyUsers: agencyCount }));
      } catch (error) {
        console.error("Error fetching users stats:", error);
      }
    };

    fetchStats();
  }, [getToken]);
  

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1">
        <SuperAdminSideBar onSelectTab={setActiveTab} activeTab={activeTab} />
        <main className="flex-1 p-6">
          {activeTab === "home" && 
            <div className="space-y-16" >
              <p>Welcome to the Super Admin Dashboard!</p>

              {/* Stats cards */}
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="border p-4 flex flex-col items-center justify-center">
                  <p>Persons</p>
                  <p className="font-bold mt-2">{stats.persons}</p>
                </div>
                <div className="border p-4 flex flex-col items-center justify-center">
                  <p>Companies</p>
                  <p className="font-bold mt-2">{stats.companies}</p>
                </div>
                <div className="border p-4 flex flex-col items-center justify-center">
                  <p>Requests</p>
                  <p className="font-bold mt-2">{stats.requests}</p>
                </div>
                <div className="border p-4 flex flex-col items-center justify-center">
                  <p>Users</p>
                  <p className="font-bold mt-2">{stats.users}</p>
                </div>
                <div className="border p-4 flex flex-col items-center justify-center">
                  <p>Agency Users</p>
                  <p className="font-bold mt-2">{stats.agencyUsers}</p>
                </div>
              </div>
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
