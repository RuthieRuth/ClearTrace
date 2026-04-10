"use client";

import { useState } from "react";
import NewEntry from "./NewPlatfomUser";

const Companies = () => {
  const [newEntry, setNewEntry] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h1>Companies</h1>
        <button
          className="border rounded-lg p-2"
          onClick={() => setNewEntry(true)}
        >
          Add new company
        </button>
      </div>
      <div>map of companies and their details to be implemented</div>

      {newEntry && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <NewEntry onClose={() => setNewEntry(false)} context="company" />
        </div>
      )}
    </div>
  );
};

export default Companies;
