"use client";

import { useEffect, useState } from "react";
import NewEntry from "./NewPlatfomUser";
import { useAuth } from "@clerk/nextjs";
import EditUser from "./EditUser";
import { IoCaretDownOutline, IoCaretUp } from "react-icons/io5";

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
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Government Agencies Users List (Police, Courts, etc)</h1>
        <button
          className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          onClick={() => setNewEntry(true)}>
          + Add new agency user
        </button>
      </div>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full max-w-md"
        />
      </div>

      <div className="space-y-4">
        {Object.entries(groupByAgency).map(([agencyType, members]) => (

        <div key={agencyType} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center cursor-pointer">
            <h2 className="text-lg font-bold text-gray-900">
              {agencyType}
            </h2>
            <p
              className="text-gray-500"
              onClick={() => setOpenAgency(openAgency === agencyType ? null : agencyType)}>
              {openAgency === agencyType ? <IoCaretUp /> : <IoCaretDownOutline />}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-1 mb-3">Number of users: {members.length}</p>
          {(openAgency === agencyType || searchTerm.trim() !== "") && (
            <div className="bg-gray-50 rounded-lg p-2 space-y-1">
              {members.map((user) => (
              <div
                key={user.id}
                className={`flex justify-between items-center px-3 py-2 rounded-md ${!user.is_active ? "opacity-50" : ""}`}>
                <div>
                  <p className="text-sm text-gray-800">
                    {user.full_name}{" "}
                    {!user.is_active && (
                      <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full ml-1">
                        Deactivated
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium rounded-md px-2.5 py-1 transition-colors"
                    onClick={() => setEditUser(user)}
                    disabled={!user.is_active}>
                      Edit
                  </button>
                  <button
                    className={`text-xs font-medium rounded-md px-2.5 py-1 border transition-colors ${
                      user.is_active
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-green-200 text-green-600 hover:bg-green-50"
                    }`}
                    onClick={() => user.is_active ? setDeleteUser(user) : BanUser(user.id, true)}>
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
        ))}
      </div>

      {newEntry && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <NewEntry onClose={() => setNewEntry(false)}  context="agency"/>
        </div>
      )}

      {editUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
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
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="border rounded-xl shadow-lg p-6 bg-white w-80">
            <p className="text-gray-800 mb-5">Are you sure you want to deactivate this user?</p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                onClick={() => {
                BanUser(deleteUser.id, !deleteUser.is_active); setDeleteUser(null); }}
                >Yes</button>
              <button
                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                onClick={() => setDeleteUser(null)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agencies;
