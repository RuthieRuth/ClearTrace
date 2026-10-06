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

  const { getToken } = useAuth();
  const [stats, setStats] = useState({
    persons: 0,
    companies: 0,
    requests: 0,
    users: 0,
    agencyUsers: 0,
  });
  const [newEntry, setNewEntry] = useState(false); 

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
        if (!usersStats.ok) {
          throw new Error(`Failed to fetch users: ${usersStats.status}`);
        }
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
              <p>Dashboard</p>
              <p>Welcome to the Super Admin Dashboard!</p>

              {/* Stats cards */}
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="border p-4 flex flex-col items-center justify-center" 
                  onClick={() => console.log("New person card clicked")}>
                  <p>Persons</p>
                  <p className="font-bold mt-2">{stats.persons}</p>
                </div>
                <div className="border p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    console.log('Companies card clicked');
                    setActiveTab('companies');
                  }}>
                  <p>Companies</p>
                  <p className="font-bold mt-2">{stats.companies}</p>
                </div>
                <div className="border p-4 flex flex-col items-center justify-center" onClick={() => {setActiveTab('requests');}}>
                  <p>Requests</p>
                  <p className="font-bold mt-2">{stats.requests}</p>
                </div>
                <div className="border p-4 flex flex-col items-center justify-center" onClick={() => {setActiveTab('users');}}>
                  <p>Users</p>
                  <p className="font-bold mt-2">{stats.users}</p>
                </div>
                <div className="border p-4 flex flex-col items-center justify-center" onClick={() => {setActiveTab('agencies');}}>
                  <p>Agency Users</p>
                  <p className="font-bold mt-2">{stats.agencyUsers}</p>
                </div>
              </div>
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
