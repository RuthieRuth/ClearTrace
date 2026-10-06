'use client'

interface SidebarProps {
  onSelectTab: (tab: string) => void;
  activeTab: string;
}

const SuperAdminSideBar = ({onSelectTab, activeTab}: SidebarProps) => {

  return (
    
    <div className='flex flex-col gap-2 w-48 border-r min-h-full p-4'>
      <p className='font-light p-2'>OVERVIEW</p>
      <button
        className={`p-2 text-left rounded border ${activeTab === 'home' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('home')}
      >
        Home
      </button>
      {/* <button
        className={`p-2 text-left rounded border ${activeTab === 'newEntry' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('newEntry')}
      >
        New Entry
      </button> */}
       <p className='font-light p-2'>MANAGEMENT</p>
      <button
        className={`p-2 text-left rounded border ${activeTab === 'agencies' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('agencies')}
      >
        Agencies
      </button>
      <button
        className={`p-2 text-left rounded border ${activeTab === 'companies' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('companies')}
      >
        Companies
      </button>
       <button
        className={`p-2 text-left rounded border ${activeTab === 'requests' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('requests')}
      >
        Requests
      </button>
      <button
        className={`p-2 text-left rounded border ${activeTab === 'peopleLogs' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('peopleLogs')}
      >
        People / Logs
      </button>
       <p className='font-light p-2'>RECORDS</p>
       <button
        className={`p-2 text-left rounded border ${activeTab === 'search' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('search')}
      >
        Search
      </button>
    </div>
  )
  
}

export default SuperAdminSideBar