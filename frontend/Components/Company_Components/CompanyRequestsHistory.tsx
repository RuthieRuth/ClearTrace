import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

type Request = {
  person: { full_name: string; national_id_no: string };
  purpose: string;
  submitted_at: string;
  status: string;
  expires_at?: string;
};

const CompanyRequestsHistory = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  const {getToken} = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
    const token = await getToken();

    axios
      .get("http://localhost:3000/requests/company", 
        { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log("Fetched requests:", response.data);
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
      });
    };

    fetchRequests();
  }, [getToken]);


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold text-gray-800">All Requests</h1>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Person</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Expires</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((request, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{request.person.full_name}</p>
                  <p className="text-xs text-gray-400">{request.person.national_id_no}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{request.purpose}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(request.submitted_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={
                    request.status === "approved" ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
                    : request.status === "rejected" ? "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium"
                    : request.status === "expired" ? "bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium"
                    : "bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium"
                  }>
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {request.expires_at ? new Date(request.expires_at).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">No requests found.</p>
      )}
    </div>
  );
};

export default  CompanyRequestsHistory;
