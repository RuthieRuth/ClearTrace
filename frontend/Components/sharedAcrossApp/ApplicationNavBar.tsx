'use client'
import Link from 'next/link'
import React from 'react'
import { UserButton, SignOutButton } from '@clerk/nextjs'
import { useAuth } from '@clerk/nextjs'

const ApplicationNavBar = () => {
  const { isSignedIn, sessionClaims } = useAuth()
  const role = (sessionClaims?.metadata as { role?: string })?.role

  return (
    <div> 
      <section className="mx-auto p-5">
        <div className="flex justify-between">
          <h1>Org name/logo</h1>

          {/* {!isSignedIn && (
            <Link href="/login" className="border rounded-xl p-1">Login</Link>
          )} */}

         {/*  {isSignedIn && (
            <UserButton />
          )} */}

        <div className='flex items-center gap-2 border rounded-2xl'>
          {role && <span className="text-sm text-gray-500">{role}</span>}
          <UserButton />
        </div>

        </div>
      </section>
    </div>
  )
}

export default ApplicationNavBar
