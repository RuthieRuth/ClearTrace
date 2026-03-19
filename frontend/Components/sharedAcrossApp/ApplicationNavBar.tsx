import Link from 'next/link'
import React from 'react'

const ApplicationNavBar = () => {
  return (
    <div> 
        <section className="mx-auto p-5">
          <div className="flex justify-between">
            <h1>Org name/logo</h1>
            <Link href="/login" className="border rounded-xl p-1 ">login here</Link>
          </div>
        </section></div>
  )
}

export default ApplicationNavBar