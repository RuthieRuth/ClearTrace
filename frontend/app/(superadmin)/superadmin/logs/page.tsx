import Link from 'next/link';


const SuperAdminLogs = () => {
  return (
    <div className='m-10'>
        <Link href="/superadmin" className="border rounded-xl p-1 ">back to super admin page</Link>

        <div className="flex flex-col items-center m-10 ">
            <h1>List of logs</h1>    
            
     </div>
    </div>
  );
};

export default SuperAdminLogs;


