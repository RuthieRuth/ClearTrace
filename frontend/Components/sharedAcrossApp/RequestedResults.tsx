'use client'

import { useRouter } from 'next/navigation'

const RequestedResults = () => {
  const router = useRouter()

  return (
    <div>
      <button onClick={() => router.back()} className="border rounded-xl p-1">
        back
      </button>

      <div className='mt-5'>
        <h1 className='mb-5 font-bold'>Search Results here</h1>
        <h1>Requested date:</h1>
        <h1>Purpose</h1>

        <h1 className='font-bold mt-10'>Personal Basic Info</h1>
        <p>Full name:</p>
        <p>Date of Birth:</p>
        <p>National ID No:</p>
        <p>Consent reference:</p>

        <h1 className='font-bold mt-10'>Government Section</h1>
        <p>details here per department</p>
      </div>
    </div>
  )
}

export default RequestedResults
