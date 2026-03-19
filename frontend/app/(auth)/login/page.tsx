'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const route = useRouter();

  const handleLogin = () => {
      console.log('Login button clicked');
      axios.post('http://localhost:3000/auth/login', { username, password })

        .then(response => {
          //console.log('Login successful:', response.data);
          
          // get token
          const token = response.data.access_token;
          const payload = JSON.parse(atob(token.split('.')[1]));
          const readRole = payload.role;
    
          // store token in cookie in the browser 
          document.cookie = `token=${token}; secure; samesite=strict`;

          // Redirect based on role
          if (readRole === 'superadmin') {
            route.push('/superadmin');
          }
          else if (readRole === 'government') {
            route.push('/government');
          }
          else {
            route.push('/company');
          }
        })
        .catch(error => {
          console.error('Login failed:', error);
          // Handle login failure, e.g., show error message
        });
  };

  return (
    <div className='m-10'>
        <Link href="/" className="border rounded-xl p-1 ">Homepage</Link>

      <div className="flex flex-col items-center m-10 ">
        <h2 className="flex flex-col items-center justify-center font-bold text-2xl mb-4">
          Welcome,
        </h2>
        <div className="flex gap-5 mb-4">
          <p className="mt-1">Username:</p>
          <input 
             className="border border-gray-300 rounded-md p-2" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="flex gap-5" >
          <p>Password:</p>
          <input className="border border-gray-300 rounded-md p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
          <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md mt-5"
          onClick={handleLogin}>
          Sign in
          </button>
        
        <div className='flex mt-10 gap-5'>
          <Link href="/company" className="border rounded-xl p-1">company</Link>
          <Link href="/government" className="border rounded-xl p-1">government agencies</Link>
          <Link href="/superadmin" className="border rounded-xl p-1 ">superadmin</Link>
        </div>

    </div>
    </div>
  );
};

export default Login;


