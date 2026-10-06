import SearchResults from "@/Components/sharedAcrossApp/RequestedResults";
import React from "react";
import NavBar from "@/Components/DashboardLayoutPerRole/NavBar";

const CompanyResultsPage = () => {
  return (
    <div className="m-10">
      <NavBar />
      <SearchResults />
    </div>
  );
};

export default CompanyResultsPage;
