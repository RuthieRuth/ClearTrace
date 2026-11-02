import NavBar from "@/Components/DashboardLayoutPerRole/NavBar";
import Link from 'next/link'
import { IoArrowForwardOutline, IoBusiness, IoPeople, IoPerson } from "react-icons/io5";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NavBar />
      <main className="flex-1 items-center ">
        {/* Navigate to login */}

        {/* Navigation to pages/routes */}
        <div>
          <p className=" flex m-5 justify-center text-sky-800">PUBLIC SERVICE</p>
          <p className="flex text-4xl font-bold mb-4 justify-center">Request a criminal record</p>
          <p className=" flex justify-center text-gray-500">Choose who you are applying for to get started</p>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="flex gap-4 m-5 justify-center">
              <div className="border-2 rounded-xl p-10 flex flex-col gap-4">
                <IoPerson className="text-3xl text-sky-700" />
                <p className="text-lg font-semibold">For myself</p>
                <p>Apply for your own extract</p>
                <div className="flex gap-2 items-center">
                <Link href="/login" className="text-sky-800">Start</Link>
                <IoArrowForwardOutline />
                </div>
              </div>
              <div className="border-2 rounded-xl p-10 flex flex-col gap-4">
                <IoPeople className="text-3xl text-sky-700" />
                <p className="text-lg font-semibold">Another person </p>
                <p>Apply for a family member or friend</p>
                <div className="flex gap-2 items-center">
                  <Link href="/login" className="text-sky-800">Start</Link>
                  <IoArrowForwardOutline />
                </div>
              </div>
              <div className="border-2 rounded-xl p-10 flex flex-col gap-4">
                <IoBusiness className="text-3xl text-sky-700" />
                <p className="text-lg font-semibold">A company </p>
                <p>Apply on behalf of a company</p>
                <div className="flex gap-2 items-center">
                  <Link href="/login" className="text-sky-800">Start</Link>
                  <IoArrowForwardOutline />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
         <div className="container mx-auto">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-2xl font-bold">How it works</h1>
            <p className="text-lg">Choose the option that best fits your needs</p>
            <p className=" text-gray-500 mb-4" >Select the option that matches your situation.</p>
            <p className="text-lg">Fill out the application form and submit your request</p>
            <p className=" text-gray-500 mb-4">Provide the necessary information and documents to complete your application.</p>
            <p className="text-lg">Follow the instructions</p>
            <p className=" text-gray-500 mb-4">See the applicable next steps after submitting your application.</p>
          </div>
        </div>

        {/* footer */}
        <div className="container mt-20 mx-auto">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-xl font-semibold">Need help? </p>
            <div className="flex gap-8 items-center justify-center">
              <p>Contact</p>
              <p>Privacy</p>
              <p>Accessibility</p>
              <p>Help & instructions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
