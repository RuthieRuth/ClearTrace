'use client'

interface SidebarProps {
  onSelectTab: (tab: string) => void;
  activeTab: string;
}

const DataOfficerSidebar = ({ onSelectTab, activeTab }: SidebarProps) => {
  return (
    <div className='flex flex-col gap-2 w-48 border-r min-h-full p-4'>
      <button
        className={`p-2 text-left rounded border ${activeTab === 'home' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('home')}
      >
        Home
      </button>
{/*       <button
        className={`p-2 text-left rounded border ${activeTab === 'newPerson' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('newPerson')}
      >
        New Person
      </button> */}
      <button
        className={`p-2 text-left rounded border ${activeTab === 'search' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('search')}
      >
        Search
      </button>
      <button
        className={`p-2 text-left rounded border ${activeTab === 'history' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('history')}
      >
        History
      </button>
    </div>
  )
}

export default DataOfficerSidebar
