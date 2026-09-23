"use client";

import { useState } from "react";
import NewEntry from "./NewPlatfomUser";
import NewCompany from "./NewCompany";
import { useAuth } from "@clerk/nextjs";

type Props = {
  onClose: () => void;
}; 
const Companies = ({ onClose }: Props) => {
  const [newCompany, setNewCompany] = useState(false);
  const [newEntry, setNewEntry] = useState(false); 
  const [companies, setCompanies] = useState<any[]>([]); // State to hold the list of companies
  const { getToken } = useAuth();

  // Fetch companies from the backend (this is a placeholder, implement actual fetching logic)
  const fetchCompanies = async () => {
   const token = await getToken();
   try{
    const response = await fetch("http://localhost:3000/companies", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCompanies(data);
    console.log("Fetched companies:", data);
   }
   catch (error) {
    console.error("Error fetching companies:", error);
   }
  };

  // Call fetchCompanies when the component mounts
  useState(() => {
    fetchCompanies();
  }, []);

  return (
    <div>
      <h1>List of Companies</h1>
        <div className="flex gap-5 my-10 items-center justify-center">
          <button className="border rounded-lg p-2" onClick={() => setNewCompany(true)}>
            Add new company 
          </button>
          <button className="border rounded-lg p-2" onClick={() => setNewEntry(true)}>
            Add new company user
          </button>
        </div>
     
      <div>
        {companies.map((company) => (
          <div key={company.id} className="border p-4 mb-4">
            <h2 className="font-semibold">{company.name}</h2>
            <p>Email: {company.contact_email}</p>
            <p>Phone: {company.contact_phone}</p>
          </div>
        ))}
      </div>

      {newCompany && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <NewCompany onClose={() => setNewCompany(false)} />
        </div>
      )}

      {newEntry && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <NewEntry onClose={() => setNewEntry(false)} context="company" />
        </div>
      )}
    </div>
  );
};

export default Companies;
