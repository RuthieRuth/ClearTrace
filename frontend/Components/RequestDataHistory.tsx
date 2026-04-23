import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";


const RequestDataHistory = () => {
  const [requests, setRequests] = useState<any[]>([]);

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
      <h1 className="mb-5">Company Page Dashboard</h1>
      <p className="mb-5"> All Recents requests</p>
      
      {requests.length >= 1 
        ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th>no.</th>
                <th>Person</th>
                <th>Purpose</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td className="flex flex-col">
                    <p>{request.person.full_name}</p>
                    <p>{request.person.national_id_no}</p>
                  </td>
                  <td>{request.purpose}</td>
                  <td>{new Date(request.submitted_at).toLocaleDateString()}</td>
                  <td>{request.status}</td>
                  <td>{request.expires_at ? new Date(request.expires_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table> )
        : (<p>No requests found.</p>) }
    </div>
  );
};

export default  RequestDataHistory;
