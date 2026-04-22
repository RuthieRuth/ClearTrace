"use client";

import { useEffect, useState } from "react";
import { getToken } from "@clerk/nextjs";
import axios from "axios";

const RequestLists = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [confirmAcceptBox, setConfimAcceptBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    const token = await getToken();

    try {
      const response = await fetch("http://localhost:3000/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to fetch requests. Please try again.");
    }
  };

  const handleAccept = async (id: string) => {
    const token = await getToken();

    console.log("Accept request clicked");
    setIsLoading(true);

    axios
      .patch(
        `http://localhost:3000/requests/${id}`,
        { status: "approved" },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        console.log("Request accepted:", response.data);
        fetchRequests();
        setConfimAcceptBox(false);
        setIsLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error("Error accepting request:", error);
        setIsLoading(false);
        setError("Failed to approve request. Please try again.");
      });
  };

  const confirmAccept = () => {
    console.log("Accept button clicked");
    setConfimAcceptBox(true);
  };

  const handleReject = () => {
    console.log("Reject request clicked");
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h1>Request Lists</h1>
        {/*         <button
          className="border rounded-lg p-2"
          onClick={() => setNewEntry(true)}
        >
         View request list and details
        </button> */}
      </div>
      <div>
        {requests.map((request) => (
          <div
            key={request.person.id}
            className="border flex  gap-10 rounded-lg p-2 mb-4"
          >
            {/* company requesting access */}
            <p>{request.company.name}</p>
            <p>{request.purpose}</p>
            {/* person details */}
            <p>{request.person.national_id_no}</p>
            <p>{request.person.full_name}</p>
             {/* status */}
            <span className={
              request.status === 'approved' ? 'bg-green-100 text-green-700 p-1 rounded' 
              : request.status === 'rejected' ? 'bg-red-100 text-red-700 p-1 rounded' 
              : 'bg-gray-100 text-gray-700 p-1 rounded'}>
              {request.status}
            </span>

            {request.status === 'submitted' && (
              <div>
                <button onClick={confirmAccept}>ACCEPT</button>
                <button onClick={handleReject}>REJECT</button>
              </div>
            )}

            {confirmAcceptBox && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">Approve Request</h2>
                  <p className="text-sm text-gray-500 mb-6">This will grant the company access to the person&apos;s record.</p> 
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Company</span>
                      <span className="font-medium text-gray-800">{request.company.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Person</span>
                      <span className="font-medium text-gray-800">{request.person.full_name}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                      onClick={() => handleAccept(request.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Approving..." : "Approve"}
                    </button>
                    <button
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors"
                      onClick={() => setConfimAcceptBox(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {error && (<div className="text-red-500 text-sm mt-2">{error}</div>)}
      </div>
    </div>
  );
};

export default RequestLists;
