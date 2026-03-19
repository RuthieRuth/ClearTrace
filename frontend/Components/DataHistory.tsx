import React, { useState } from 'react'
import SearchResults from './sharedAcrossApp/SearchResults'
import Link from 'next/link'

const DataHistory = () => {
  const [viewDetails, setViewDetails] = useState(false);

  console.log('view details clicked:', viewDetails)

  return (
    <div>
      <h1 className='mb-5'>Data History as a tracking tool</h1>

      <table className='table-auto'>
        <thead >
          <tr>
            <th>no.</th>
            <th>Person</th>
            <th>Purpose</th>
            <th>Submitted</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Jane Doe</td>
            <td>Employment</td>
            <td>2024-06-01</td>
            <td>Pending</td>
            <td>
              <Link href="/company/details">View details</Link>
            </td>
          </tr>
        </tbody>
      </table>

      {viewDetails && <SearchResults />}
    </div>
  )
}

export default DataHistory