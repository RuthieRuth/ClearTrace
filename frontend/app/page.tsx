import NavBar from "@/Components/DashboardLayoutPerRole/NavBar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NavBar />
      <main className="flex-1">
        {/* Navigate to login */}

        <div className="border-4 b"></div>

        {/* Navigation to pages/routes */}
        <section className="flex mx-auto p-3 gap-4 justify-between">
          <button className="border rounded-xl p-1">front page</button>
          <button className="border rounded-xl p-1">Criminal records extracts</button>
          <button className="border rounded-xl p-1">instructions</button>
        </section>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-black mb-6 text-6xl font-bold">Offense Registry</h1>
            <p>short explanation of this service</p>
            <div className="flex gap-4 mt-5">
              <button className="border rounded-xl p-1">Use the service on your own behalf </button>
              <button className="border rounded-xl p-1">Use the service on behalf of another person </button>
              <button className="border rounded-xl p-1">Act on behalf of a company </button>
            </div>
          </div>
        </section>

        {/* Service Display */}
        <section className="mx-auto p-5">
          <h1 className="mb-6 text-2xl">Our services</h1>
        </section>

        {/* footer */}
        <section className="mx-auto p-5">
          <p>Details of foooter</p>
        </section>
      </main>
    </div>
  );
}
