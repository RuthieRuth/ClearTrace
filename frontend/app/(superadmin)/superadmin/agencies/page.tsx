import Link from 'next/link';


const SuperAdminAgencies = () => {
  return (
    <div className='m-10'>
        <Link href="/superadmin" className="border rounded-xl p-1 ">back to super admin page</Link>

        <div className="flex flex-col items-center m-10 ">
            <h1>List of agencies</h1>    
            
     </div>
    </div>
  );
};

export default SuperAdminAgencies;


