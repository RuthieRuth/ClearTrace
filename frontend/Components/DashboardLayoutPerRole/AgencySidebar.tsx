'use client'

interface SidebarProps {
  onSelectTab: (tab: string) => void;
  activeTab: string;
}

const AgencySidebar = ({ onSelectTab, activeTab }: SidebarProps) => {
  return (
    <div className='flex flex-col gap-2 w-48 border-r min-h-full p-4'>
      <button
        className={`p-2 text-left rounded border ${activeTab === 'home' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('home')}
      >
        Home
      </button>
      <button
        className={`p-2 text-left rounded border ${activeTab === 'search' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectTab('search')}
      >
        Search
      </button>
      <button className='p-2 text-left rounded border'>
        People / Logs
      </button>
    </div>
  )
}

export default AgencySidebar
