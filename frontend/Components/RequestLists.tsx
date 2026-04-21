"use client";

import { useEffect, useState } from "react";
import { getToken } from "@clerk/nextjs";

const RequestLists = () => {
  const [requests, setRequests] = useState([]);

  

  const fetchRequests = async () => {
    const token = await getToken();

    try {
      const response = await fetch('http://localhost:3000/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
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
          <div key={request.person.id} className="border flex  gap-10 rounded-lg p-2 mb-4">
            {/* company requesting access */}
            <p>{request.company.name}</p>
            <p>{request.purpose}</p>
            {/* person details */}
            <p>{request.person.national_id_no}</p>
            <p>{request.person.full_name}</p>

            {/* <p>{request.status}</p> */}

            <button>
                <p>ACCEPT</p>
            </button>
            <button>
                <p>REJECT</p>
            </button>
            
          </div>
        ))}
      </div>

    </div>
  );
};

export default RequestLists;
