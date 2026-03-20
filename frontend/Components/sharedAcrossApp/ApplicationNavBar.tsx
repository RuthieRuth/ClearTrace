'use client'
import Link from 'next/link'
import React from 'react'
import { UserButton, SignOutButton } from '@clerk/nextjs'
import { useAuth } from '@clerk/nextjs'

const ApplicationNavBar = () => {
  const { isSignedIn } = useAuth()

  return (
    <div> 
      <section className="mx-auto p-5">
        <div className="flex justify-between">
          <h1>Org name/logo</h1>
          {!isSignedIn && (
            <Link href="/login" className="border rounded-xl p-1">Login</Link>
          )}
          {isSignedIn && (
            <UserButton />
          )}
        </div>
      </section>
    </div>
  )
}

export default ApplicationNavBar
