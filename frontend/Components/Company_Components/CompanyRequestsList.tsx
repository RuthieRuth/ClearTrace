import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useState } from 'react'

type Request = {
  person: { full_name: string; national_id_no: string; offenses: { id: string; category: string; severity: string }[] };
  purpose: string;
  submitted_at: string;
  status: string;
  expires_at?: string;
};

const CompanyRequestsList = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {getToken} = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
    const token = await getToken();
    setIsLoading(true);

    axios
      .get("http://localhost:3000/requests/approved", 
        { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log("Fetched requests:", response.data);
        setRequests(response.data);
        setIsLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
        setIsLoading(false);
         setError("Failed to fetch requests. Please try again.");
      });
    };

    fetchRequests();
  }, [getToken]);

  const handleViewDetails = (request: Request) => {
    console.log("View details clicked for request:", request);
    setSelectedApproval(request);
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        {isLoading ? (<p>Loading requests...</p>) : (
         <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Person</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
               <th className="px-4 py-3">view</th>
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
                 <td className="px-4 py-3 text-gray-600">
                  <button className="text-blue-600 hover:underline" onClick={() => handleViewDetails(request)}>
                    Open 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>)}
      </div>

      {requests.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">No approved requests found.</p>
      )}

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {/* view details in modal*/}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">

            {/* Header */}
            <div className="bg-slate-700 text-white px-8 py-6 rounded-t-xl">
              <p className="text-xs uppercase tracking-widest text-slate-300 mb-1">Confidential Screening Report</p>
              <p className="text-xl font-bold">Background Check Result</p>
            </div>

            <div className="px-8 py-6 space-y-6">

            {/* Identification */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Identification</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Full Name</span>
                  <span className="font-medium text-gray-900">{selectedApproval.person.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">National ID</span>                   
                  <span className="font-medium text-gray-900">{selectedApproval.person.national_id_no}</span>
                </div>
              </div>
            </div>

              {/* Result */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Offense Record</h3>
                {selectedApproval.person.offenses.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                      <p className="text-sm font-medium text-gray-800">Offense record exists for this person.</p>
                    </div>
                    <div className="flex flex-col gap-2 pt-1">
                      {selectedApproval.person.offenses.map((offense) => (
                        <div key={offense.id} className="flex items-center justify-between px-1 py-1.5 text-xs">
                          <span className="font-medium capitalize">{offense.category.replace(/_/g, ' ')}</span>
                          <span className={
                            offense.severity === 'high' ? 'bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-semibold'
                            : offense.severity === 'medium' ? 'bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold'
                            : 'bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold'
                          }>
                            {offense.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <span className="text-green-600 text-lg">✓</span>
                    <p className="text-sm font-medium text-green-700">No offense record found for this person.</p>
                  </div>
                )}
              </div>

              {/* Close button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="px-5 py-2 text-sm font-medium bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>

              <div>
                This result expires on (date). After this date it will no longer be accessible and a new request will need to be submitted to obtain an updated report.
                This is logged and monitored by the offense registry authority.
              </div>
              
            

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyRequestsList