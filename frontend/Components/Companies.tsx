"use client";

import { useState } from "react";
import NewEntry from "./NewPlatfomUser";
import NewCompany from "./NewCompany";

type Props = {
  onClose: () => void;
}; 
const Companies = ({ onClose }: Props) => {
  const [newCompany, setNewCompany] = useState(false);
  const [newEntry, setNewEntry] = useState(false); 

  return (
    <div>
      <h1>Companies</h1>
        <div className="flex gap-5 my-10">
          <button
            className="border rounded-lg p-2"
            onClick={() => setNewCompany(true)}
          >
            Add new company 
          </button>
          <button
            className="border rounded-lg p-2"
            onClick={() => setNewEntry(true)}
          >
            Add new company user
          </button>
        </div>
     
      <div>map of companies and their details to be implemented</div>

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
