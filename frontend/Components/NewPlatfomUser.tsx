'use client'
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

type Props = {
  onClose: () => void;
};

const NewEntry = ({ onClose }: Props) => {
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [agencyType, setAgencyType] = useState('')
  const [confirmationBox, setConfirmationBox] = useState(false)
  const { getToken } = useAuth()

  const confirmNewEntry = () => {
    setConfirmationBox(true)
  }

  const submitEntry = async () => {
    const token = await getToken()
    axios.post('http://localhost:3000/users',
      { full_name: fullname, username, password, role, agency_type: agencyType },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(response => {
        console.log('Entry saved successfully:', response.data);
        setConfirmationBox(false)
        onClose()
      })
      .catch(error => {
        console.error('Error saving entry:', error);
        alert('Failed to save entry. Please try again.')
        setConfirmationBox(false)
      });
  }

  const cancelEntry = () => {
    setConfirmationBox(false)
  }

  return (
    <div className='m-10 border rounded-lg p-6 bg-white'>
      <p onClick={onClose} className="flex items-end justify-end mb-4 hover:underline">close</p>

      <h1 className="font-semibold">PERSONAL DETAILS</h1>
      <div className="flex gap-5 mb-2">
        <p className="mt-1">Full Name:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
      </div>

      <h1 className="font-semibold">ROLE AND ACCESS</h1>
      <div className="flex gap-5 mb-2 ">
        <p className="mt-1">Role:</p>
        <div className="grid">
          <select 
            className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
            value={role}
            onChange={(e) => setRole(e.target.value)}>
            <option>government</option>
            <option>company</option>
            <option>superadmin</option>
          </select>
        </div>
      </div>

      <div className="flex gap-5 mb-2 ">
        <p className="mt-1">Agency Type:</p>
        <div className="grid">
          <select 
            className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
            value={agencyType}
            onChange={(e) => setAgencyType(e.target.value)}>
            <option>police</option>
            <option>immigration</option>
            <option>courts</option>
            <option>prison</option>
            <option>education</option>
            <option>health</option>
            <option></option>
          </select>
        </div>
      </div>
     

      <h1 className="font-semibold">LOG IN DETAILS</h1>
      <div className="flex gap-5 mb-2">
        <p className="mt-1">Username:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <p className="mt-1">Password:</p>
        <input className="border border-gray-300 rounded-md p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className='mb-10'>
        <button className='border p-2' onClick={confirmNewEntry}>SAVE</button>
      </div>

      {confirmationBox && (
        <div>
          <h1 className="font-semibold">CONFIRM POPUP</h1>
          <p>Are you sure you want to save this entry?</p>
          <div className='flex gap-5 mt-5'>
            <button className='border p-2' onClick={submitEntry}>Confirm</button>
            <button className='border p-2' onClick={cancelEntry}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewEntry;
