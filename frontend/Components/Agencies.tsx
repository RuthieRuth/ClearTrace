"use client";

import { useEffect, useState } from "react";
import NewEntry from "./NewPlatfomUser";
import { useAuth } from "@clerk/nextjs";
import EditUser from "./EditUser";

type User = {
  id: string;
  full_name: string;
  role: string;
  agency_type: string;
  is_active: boolean;
};

const Agencies = () => {
  const [newEntry, setNewEntry] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openAgency, setOpenAgency] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

    const searchedUsers = agencyUsers.filter(user =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupByAgency = searchedUsers.reduce<Record<string, User[]>>((accumulator, user) => {
      const key = user.agency_type;
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(user);
      return accumulator;
    }, {});

  console.log("Grouped users by agency:", groupByAgency);

  // Function to ban/restrict a user
  const BanUser = async (userId: string, nextActive: boolean) => {
    const token = await getToken();
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: nextActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to restrict user");
      }

      // Update the local state to remove the deactivated user
      setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, is_active: nextActive } : user));
    } catch (error) {
      console.error("Error restricting user:", error);
      setError("Failed to restrict user. Please try again.");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h1 className="flex items-center justify-center">Government Agencies Users List (Police, Courts, etc)</h1>
        <button className="border rounded-lg p-2" onClick={() => setNewEntry(true)}>
          Add new agency user
        </button>
      </div>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full max-w-md"
        />
      </div>

      <div>
        {Object.entries(groupByAgency).map(([agencyType, members]) => (

        <div key={agencyType} className="border p-4 mb-4">
          <div className="flex justify-between items-center cursor-pointer">
            <h2 className="text-xl font-bold">
              {agencyType}
            </h2>
            <p onClick={() => setOpenAgency(openAgency === agencyType ? null : agencyType)}>
              {openAgency === agencyType ? "close" : "open"}
            </p>
          </div>
          <p className="mb-4">Number of users: {members.length}</p>
          {(openAgency === agencyType || searchTerm.trim() !== "") && (
            members.map((user) => (
            <div key={user.id} className={`p-1 mb-2 flex justify-between border-b last:border-b-0 pb-1 ${!user.is_active ? "opacity-50" : ""} `}>
              <div>
                <p>{user.full_name} {!user.is_active && <span className="text-red-500 text-xs">(DEACTIVATED)</span>} </p>
                <p>{user.role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="border rounded-lg p-1" 
                  onClick={() => setEditUser(user)}
                  disabled={!user.is_active}>
                    Edit
                </button>
                <button 
                  className="border rounded-lg p-1" 
                  onClick={() => user.is_active ? setDeleteUser(user) : BanUser(user.id, true)}>
                  {user.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
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

      {editUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <EditUser
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={(updatedUser) => {
              setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
              setEditUser(null);
            }}
          />
        </div>
      )}

      {deleteUser && (
         <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="m-10 border rounded-lg p-6 bg-white">
            <p>Are you sure you want to deactivate this user?</p>
            <div className="flex gap-4 mt-5">
              <button className="border rounded-lg p-2" onClick={() => {
                BanUser(deleteUser.id, !deleteUser.is_active); setDeleteUser(null); }}
                >Yes</button>
              <button className="border rounded-lg p-2" onClick={() => setDeleteUser(null)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agencies;
