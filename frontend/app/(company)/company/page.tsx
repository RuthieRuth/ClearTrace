// main landing page for company users

"use client";

import CompanySideBar from "@/Components/DashboardLayoutPerRole/CompanySideBar";
import { useState } from "react";
import DataHistory from "@/Components/Company_Components/CompanyRequestsHistory";
import RequestForm from "@/Components/RequestForm";
import NavBar from "@/Components/DashboardLayoutPerRole/NavBar";
import CompanyRequestsList from "@/Components/Company_Components/CompanyRequestsList";

const CompanyPage = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col h-screen">
      <NavBar />

      <div className="flex flex-1">
        <CompanySideBar onSelectedTab={setActiveTab} activeTab={activeTab} />
        <main className="flex-1 p-6">
          {activeTab === "home" && (
            <div className="space-y-16">
              <p> Company Dashboard</p>
              <p>Welcome to the Company Dashboard!</p>

              {/* section for approved requests */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Approved Requests
                </h2>
                <CompanyRequestsList />
              </div>
            </div>
          )}
          {activeTab === "requestForm" && <RequestForm />}
          {activeTab === "history" && <DataHistory />}
        </main>
      </div>
    </div>
  );
};

export default CompanyPage;
