'use client'
import Link from 'next/link'
import { useAuth, UserButton } from '@clerk/nextjs'

const NavBar = () => {
  const { sessionClaims, isSignedIn } = useAuth()
  const role = (sessionClaims?.metadata as { role?: string })?.role

  return (
    <div className="flex justify-between items-center border-b px-6 py-3">
      <h1 className="font-bold">Offense Registry</h1>
      <div className="flex gap-4 items-center">
        <button className="border rounded-xl px-3 py-1">Criminal Records</button>
        <button className="border rounded-xl px-3 py-1">Instructions</button>
        {isSignedIn ? (
          <div className='flex items-center gap-2 border rounded-2xl px-2'>
            {role && <span className="text-sm text-gray-500">{role}</span>}
            <UserButton />
          </div>
        ) : (
          <Link href="/login" className="border rounded-xl px-3 py-1">Login</Link>
        )}
      </div>
    </div>
  )
}

export default NavBar
