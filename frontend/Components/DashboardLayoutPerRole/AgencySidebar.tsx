'use client'

interface SidebarProps {
  onSelectTab: (tab: string) => void;
  activeTab: string;
}

const AgencySidebar = ({ onSelectTab, activeTab }: SidebarProps) => {
  const navClass = (tab: string) =>
    `text-left text-sm rounded-md px-3 py-2 transition-colors ${
      activeTab === tab
        ? 'bg-sky-50 text-sky-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <div className='flex flex-col gap-1 w-56 border-r border-gray-200 min-h-full p-4 bg-white'>
      <button
        className={navClass('home')}
        onClick={() => onSelectTab('home')}
      >
        Home
      </button>
      <button
        className={navClass('search')}
        onClick={() => onSelectTab('search')}
      >
        Search
      </button>
      <button className='text-left text-sm rounded-md px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors'>
        People / Logs
      </button>
    </div>
  )
}

export default AgencySidebar
