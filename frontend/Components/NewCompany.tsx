// form to register a new company user. Could be an integration with compnany registry API preferably, but for now just a form to create a new company user with a company ID field

'use client'

import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

type Props = {
  onClose: () => void;
};

const NewCompany = ({ onClose }: Props) => {
  const [fullname, setFullname] = useState('');
  const [companyId, setCompanyId] = useState('')
  const [confirmationBox, setConfirmationBox] = useState(false);
  
  const [industry, setIndustry] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const { getToken } = useAuth()
   

  const submitEntry = async () => {
    const token = await getToken()

    await axios.post('http://localhost:3000/companies',
      {name: fullname, registration_no: companyId, industry, contact_email: email, contact_phone: phone},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(response => {
      console.log('Company created:', response.data)
      setConfirmationBox(false)
      onClose()
    })
    .catch(error => {
      console.error('Error creating company:', error)
      alert('Failed to save entry. Please try again.')
      setConfirmationBox(false)
    })
  }

  const cancelEntry = () => {
    setConfirmationBox(false);
  }

  const confirmNewCompany = () => {
    setConfirmationBox(true);
  }

  return (
    <div className='m-10 border rounded-lg p-6 bg-white'>
      <p onClick={onClose} className="flex items-end justify-end mb-4 hover:underline">close</p>
      <p className="mb-10">Create a new company into database</p>
      <h1 className="font-semibold">COMPANY DETAILS</h1>
      <div className="flex gap-5 mb-2">
        <p className="mt-1">Full Name:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
      </div>

     {/*  <h1 className="font-semibold">ROLE AND ACCESS</h1>
        <div className="flex gap-5 mb-2 ">
          <p className="mt-1">Role:</p>
          <div className="grid">
            <select 
              className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
              value={role}
              onChange={(e) => {
                setRole(e.target.value)
                setCompanyId('') }}>
              <option value="">-- select --</option>
              {<option value="company">Company</option>}
            </select>
          </div>
        </div> */}
      
      <div className="flex gap-5 mb-2">
        <p className="mt-1">Registration NO:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={companyId} onChange={(e) => setCompanyId(e.target.value)} />
      </div>

      <div className="flex gap-5 mb-2">
        <p className="mt-1">Industry:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} />
      </div>

      <div className="flex gap-5 mb-2">
        <p className="mt-1">Email:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="flex gap-5 mb-2">
        <p className="mt-1">Phone:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className='mb-10'>
        <button className='border p-2' onClick={confirmNewCompany}>SAVE</button>
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
  )
}

export default NewCompany