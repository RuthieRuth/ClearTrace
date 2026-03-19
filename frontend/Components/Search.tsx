// this is for companies to search for individuals


'use client'

import Link from 'next/link';
import React, { useState } from 'react'


const Search = () => {
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

        <h1>Search for Individual </h1>

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
            className='border p-2' onClick={confirmSearch}>search</button>
        </div>

        {confirmationBox && (<div>
          <h1>CONFIRM POPUP</h1>
          <p>You are about to send a request for *Name*.</p>
          <p>This will be logged</p>
          <div className='flex gap-5 mt-5'>
            <button className='border p-2' onClick={submitRequest}>confirm</button>
            <button className='border p-2' onClick={cancelRequest}>cancel</button>
          </div>
        </div>)}

    </div>
  );
};

export default Search;


