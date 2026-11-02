'use client'

interface SidebarProps {
  onSelectTab: (tab: string) => void;
  activeTab: string;
}

const SuperAdminSideBar = ({onSelectTab, activeTab}: SidebarProps) => {

  const navClass = (tab: string) =>
    `text-left text-sm rounded-md px-3 py-2 transition-colors ${
      activeTab === tab
        ? 'bg-sky-50 text-sky-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (

    <div className='flex flex-col gap-1 w-56 border-r border-gray-200 min-h-full p-4 bg-white'>
      <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 pt-1 pb-1'>Overview</p>
      <button
        className={navClass('home')}
        onClick={() => onSelectTab('home')}
      >
        Home
      </button>
      {/* <button
        className={navClass('newEntry')}
        onClick={() => onSelectTab('newEntry')}
      >
        New Entry
      </button> */}
      <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 pt-4 pb-1'>Management</p>
      <button
        className={navClass('agencies')}
        onClick={() => onSelectTab('agencies')}
      >
        Agencies
      </button>
      <button
        className={navClass('companies')}
        onClick={() => onSelectTab('companies')}
      >
        Companies
      </button>
      <button
        className={navClass('requests')}
        onClick={() => onSelectTab('requests')}
      >
        Requests
      </button>
      <button
        className={navClass('peopleLogs')}
        onClick={() => onSelectTab('peopleLogs')}
      >
        People / Logs
      </button>
      <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 pt-4 pb-1'>Records</p>
      <button
        className={navClass('search')}
        onClick={() => onSelectTab('search')}
      >
        Search
      </button>
    </div>
  )

}

export default SuperAdminSideBar