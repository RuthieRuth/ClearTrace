// main landing page for company users

"use client";

import CompanySideBar from "@/Components/DashboardLayoutPerRole/CompanySideBar";
import { useState } from "react";
import DataHistory from "@/Components/DataHistory";
import RequestForm from "@/Components/RequestForm";
import NavBar from "@/Components/DashboardLayoutPerRole/NavBar";

const CompanyPage = () => {
  const [activeTab, setActiveTab] = useState("requestForm");

  return (
    <div className="flex flex-col h-screen">
      <NavBar />

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
