// main landing page for company users

"use client";

import CompanySideBar from "@/Components/DashboardLayoutPerRole/CompanySideBar";
import Link from "next/link";
import { useState } from "react";
import DataHistory from "@/Components/DataHistory";
import RequestForm from "@/Components/RequestForm";

const CompanyPage = () => {
  const [activeTab, setActiveTab] = useState("requestForm");

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center border-b px-6 py-3">
        <h1 className="font-bold">Offense Registry</h1>
        <Link href="/login" className="border rounded-xl px-3 py-1">
          Logout
        </Link>
      </div>

      <div className="flex flex-1">
        <CompanySideBar onSelectedTab={setActiveTab} activeTab={activeTab} />
        <main className="flex-1 p-6">
          {activeTab === "requestForm" && <RequestForm />}
          {activeTab === "history" && <DataHistory />}
        </main>
      </div>
    </div>
  );
};

export default CompanyPage;
