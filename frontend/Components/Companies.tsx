"use client";

import { useEffect, useState } from "react";
import NewEntry from "./NewPlatfomUser";
import NewCompany from "./NewCompany";
import { useAuth } from "@clerk/nextjs";
import { IoCaretDownOutline, IoCaretUp } from "react-icons/io5";

type Company = {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  industry: string;
  approved: boolean;
  registration_no: string;
  is_active: boolean;
  users: CompanyUser[];
};  

type CompanyUser = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;

};

const Companies = () => {
  const [newCompany, setNewCompany] = useState(false);
  const [newEntry, setNewEntry] = useState(false); 
  const [companies, setCompanies] = useState<Company[]>([]); // State to hold the list of companies
  const { getToken } = useAuth();
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [openCompany, setOpenCompany] = useState<string | null>(null);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch companies from the backend (this is a placeholder, implement actual fetching logic)
  // Call fetchCompanies when the component mounts
  useEffect(() => {
  const fetchCompanies = async () => {
    const token = await getToken();
    try {
      const response = await fetch("http://localhost:3000/companies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCompanies(data);
      console.log("Fetched companies:", data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
    fetchCompanies();
    }, []); 

  const ActivateDeactivateCompany = async (company: Company) => {
    const token = await getToken();
    try {
      const response = await fetch(`http://localhost:3000/companies/${company.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ is_active: !company.is_active }),
      });
      const updatedCompany = await response.json();
      setCompanies((prevCompanies) =>
        prevCompanies.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
      );
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

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
      setCompanyUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, is_active: nextActive } : user));
    } catch (error) {
      console.error("Error restricting user:", error);
      setError("Failed to restrict user. Please try again.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">List of Companies</h1>
      <div className="flex gap-3 mb-8">
        <button
          className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          onClick={() => setNewCompany(true)}>
          + Add new company
        </button>
        <button
          className="border border-gray-300 hover:bg-gray-50 text-sm font-medium rounded-lg px-4 py-2 transition-colors text-gray-700"
          onClick={() => setNewEntry(true)}>
          + Add new company user
        </button>
      </div>

      <div className="space-y-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{company.name}</h2>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Reg No: {company.registration_no}</p>
                <p className="text-sm text-gray-600">{company.industry}</p>
                <p className="text-sm text-gray-500">{company.contact_email}</p>
                <p className="text-sm text-gray-500 mb-3">{company.contact_phone}</p>
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                    company.approved ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                  {company.approved ? "Approved" : "Not Approved"}
                </span>
              </div>
              <div className="flex gap-2 items-start shrink-0">
                <button
                  className={`text-sm font-medium rounded-md px-3 py-1.5 border transition-colors ${
                    company.is_active
                      ? "border-red-200 text-red-600 hover:bg-red-50"
                      : "border-green-200 text-green-600 hover:bg-green-50"
                  }`}
                  onClick={() => company.is_active ? setActiveCompany(company) : ActivateDeactivateCompany(company)}
                >
                  {company.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  className="flex items-center gap-1 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-md px-3 py-1.5 transition-colors"
                  onClick={() => setOpenCompany(openCompany === company.id ? null : company.id)}>
                  {openCompany === company.id ? <IoCaretUp /> : <IoCaretDownOutline />} Representatives
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 mb-2">Authorised users: {company.users.length}</p>

            {openCompany === company.id && (
              <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                {company.users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex justify-between items-center px-3 py-2 rounded-md ${!user.is_active ? "opacity-50" : ""}`}>
                    <p className="text-sm text-gray-700">{user.full_name}</p>
                    <button
                      className="text-xs font-medium rounded-md px-2.5 py-1 border border-gray-300 text-gray-600 hover:bg-white transition-colors"
                      onClick={() => BanUser(user.id, !user.is_active)}>
                      {user.is_active ? "Remove" : "Add"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {newCompany && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <NewCompany onClose={() => setNewCompany(false)} />
        </div>
      )}

      {newEntry && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <NewEntry onClose={() => setNewEntry(false)} context="company" />
        </div>
      )}

      {activeCompany && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="border rounded-xl shadow-lg p-6 bg-white w-80">
            <p className="text-gray-800 mb-5">Are you sure you want to deactivate this company?</p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                onClick={() => {ActivateDeactivateCompany(activeCompany); setActiveCompany(null);
                }}>
                Yes
              </button>
              <button
                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                onClick={() => setActiveCompany(null)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
