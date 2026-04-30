"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

type Request = {
  id: string;
  company: { name: string };
  purpose: string;
  person: { national_id_no: string; full_name: string };
  status: string;
};

const AdminRequestLists = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [confirmAcceptBox, setConfimAcceptBox] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null); //Track request
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

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

    useEffect(() => {
      fetchRequests();
    }, []);

  const handleAccept = async (id: string) => {
    const token = await getToken();

    console.log("Accept request clicked");
    setIsLoading(true);

    axios
      .patch(`http://localhost:3000/requests/${id}`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` }},
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

  const confirmAccept = (id: string) => {
    console.log("Accept button clicked");
    setConfimAcceptBox(true);
    setSelectedRequest(requests.find(r => r.id === id) || null);
  };

  const handleReject = (id: string) => {
    console.log("Reject request clicked");
    setConfimAcceptBox(true);
    setSelectedRequest(requests.find(r => r.id === id) || null);
  };

   // To be used in conjuction with 'show Confirmation Box per Request selected'
   const selected = requests.find(r => r.id === selectedRequest?.id );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold text-gray-800">Request Lists</h1>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">National ID</th>
              <th className="px-4 py-3">Person</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((request) => (
              <tr key={request.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{request.company.name}</td>
                <td className="px-4 py-3 text-gray-600">{request.purpose}</td>
                <td className="px-4 py-3 text-gray-600">{request.person.national_id_no}</td>
                <td className="px-4 py-3 text-gray-800">{request.person.full_name}</td>
                <td className="px-4 py-3">
                  <span className={
                    request.status === "approved" ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
                    : request.status === "rejected" ? "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium"
                    : "bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium"
                  }>
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {request.status === "submitted" && (
                    <div className="flex gap-2">
                      <button
                      // update and add track results box
                        onClick={() => confirmAccept(request.id)} 
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show Confirmation Box per Request selected */}
      {confirmAcceptBox && (
        <td className="p-0">
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Approve Request</h2>
              <p className="text-sm text-gray-500 mb-6">This will grant the company access to the person&apos;s record.</p>
               <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Company</span>
                    <span className="font-medium text-gray-800">{selected?.company.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Person</span>
                    <span className="font-medium text-gray-800">{selected?.person.full_name}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    onClick={() => handleAccept(selected!.id)} // ! trust me, remove ur doubt 
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
         </td>
      )}

      {requests.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">No requests found.</p>
      )}

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
};

export default AdminRequestLists;
