import Link from 'next/link'

const NavBar = () => {
  return (
    <div className="flex justify-between items-center border-b px-6 py-3">
      <h1 className="font-bold">Offense Registry</h1>
      <div className="flex gap-4">
        <button className="border rounded-xl px-3 py-1">Criminal Records</button>
        <button className="border rounded-xl px-3 py-1">Instructions</button>
        <Link href="/login" className="border rounded-xl px-3 py-1">Logout</Link>
      </div>
    </div>
  )
}

export default NavBar
