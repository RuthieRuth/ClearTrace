'use client'

interface SidebarProps {
  onSelectedTab: (tab: string) => void;
  activeTab: string;
}

const CompanySideBar = ({ onSelectedTab, activeTab }: SidebarProps) => {
  return (
    <div className='flex flex-col gap-2 w-48 border-r min-h-full p-4'>
      <button
        className={`p-2 text-left rounded border ${activeTab === 'requestForm' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectedTab('requestForm')}
      >
        Request Form
      </button>
      <button
        className={`p-2 text-left rounded border ${activeTab === 'history' ? 'bg-gray-100 font-semibold' : ''}`}
        onClick={() => onSelectedTab('history')}
      >
        History / Logs
      </button>
    </div>
  )
}

export default CompanySideBar
