'use client'
import Link from 'next/link'
import { useAuth, UserButton } from '@clerk/nextjs'

const NavBar = () => {
  const { sessionClaims, isSignedIn } = useAuth()
  const role = (sessionClaims?.metadata as { role?: string })?.role

  return (
    <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3 bg-white">
      <h1 className="font-bold text-xl text-gray-900">Offense Registry</h1>
      <div className="flex gap-6 items-center">
        <p className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">Criminal Records</p>
        <p className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">Instructions</p>
        {isSignedIn ? (
          <div className='flex items-center gap-2 border border-gray-200 rounded-full pl-3 pr-1 py-1'>
            {role && <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{role}</span>}
            <UserButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors">
            Login
          </Link>
        )}
      </div>
    </div>
  )
}

export default NavBar
