// this is for companies to search for individuals

'use client'

import { useState } from "react";

const RequestForm = () => {
  const [confirmationBox, setConfirmationBox] = useState(false)

  const confirmSearch = () => {
    console.log('search button clicked')
    setConfirmationBox(true)
  }

  const submitRequest = () => {
    console.log('Submit button clicked')
    // send to the appropiate endpoint(admin)
  }

  const cancelRequest = () => {
    console.log('Cancel send button cliked')
    setConfirmationBox(false)
  }
  

  return (
    <div className='m-10'>

        <h1 className="mb-4">Application Form</h1>

        <div className="flex gap-5 mb-2">
          <p className="mt-1">Full Name:</p>
          <input className="border border-gray-300 rounded-md p-2" type="text" />
        </div>

        <div className="flex gap-5 mb-2">
          <p className="mt-1">Date of Birth:</p>
          <input className="border border-gray-300 rounded-md p-2" type="text" />
        </div>

        <div className="flex gap-5 mb-2">
          <p className="mt-1">National ID No:</p>
          <input className="border border-gray-300 rounded-md p-2" type="text" />
        </div>

        <div className="flex gap-5 mb-2">
          <p className="mt-1">Purpose:</p>
          <input className="border border-gray-300 rounded-md p-2" type="text" />
        </div>

        <div className="flex gap-5 mb-2">
          <p className="mt-1">Consent reference:</p>
          <input className="border border-gray-300 rounded-md p-2" type="text" />
        </div>

        <div className='mb-10'>
          <button 
            className='border p-2' onClick={confirmSearch}>Save</button>
        </div>

        {confirmationBox && (
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black flex items-center justify-center">
            <div className="bg-white rounded-xl p-6">
              <h1>Confirm Submission</h1>
              <p>You are about to send a request for *Name*.</p>
              <p>This will be logged</p>
              <div className='flex gap-5 mt-5'>
                <button className='border p-2' onClick={submitRequest}>confirm</button>
                <button className='border p-2' onClick={cancelRequest}>cancel</button>
              </div>
            </div>
          </div>)}

    </div>
  );
};

export default RequestForm;


