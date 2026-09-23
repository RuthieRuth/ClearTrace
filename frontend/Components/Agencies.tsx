"use client";

import { useEffect, useState } from "react";
import NewEntry from "./NewPlatfomUser";
import { useAuth } from "@clerk/nextjs";

type User = {
  id: string;
  full_name: string;
  role: string;
  agency_type: string;
};

const Agencies = () => {
  const [newEntry, setNewEntry] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openAgency, setOpenAgency] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await getToken();
      try {
        const response = await fetch("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again.");
      }
    };
    fetchUsers();
  }, []);

  // filter and group
  const agencyUsers = users.filter(user => user.role === "agency_head" || user.role === "agency_staff");

    const groupByAgency = agencyUsers.reduce<Record<string, User[]>>((accumulator, user) => {
      const key = user.agency_type;
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(user);
      return accumulator;
    }, {});


  console.log("Grouped users by agency:", groupByAgency);

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h1>Government Agency List (Police, Courts, etc)</h1>
        <button className="border rounded-lg p-2" onClick={() => setNewEntry(true)}>
          Add new agency user
        </button>
      </div>
      <div>
        {Object.entries(groupByAgency).map(([agencyType, members]) => (

        <div key={agencyType} className="border p-4 mb-4">
          <div className="flex justify-between items-center cursor-pointer">
            <h2 className="text-xl font-bold">
              {agencyType}
            </h2>
            <p onClick={() => setOpenAgency(openAgency === agencyType ? null : agencyType)}>arrow down</p>
          </div>
          <p className="mb-4">Number of users: {members.length}</p>
          {openAgency === agencyType && (
            members.map((user) => (
            <div key={user.id} className="p-2 mb-2">
              <p>{user.full_name}</p>
              <p>{user.role}</p>
            </div>
          )))}
        </div>
        ))}
      </div>

      {newEntry && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <NewEntry onClose={() => setNewEntry(false)}  context="agency"/>
        </div>
      )}
      
    </div>
  );
};

export default Agencies;
