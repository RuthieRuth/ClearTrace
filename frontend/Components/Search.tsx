// this is for government to search for individuals
'use client'
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import React, { useState } from 'react'

const Search = () => {
  const [resultBox, setResultBox] = useState([])
  const [query, setQuery] = useState('')
  const { getToken } = useAuth()
  const [results, setResults] = useState<any[]>([])
  
  const submitRequest = async () => {
    console.log('Submit button clicked')
    setResultBox([])
    setResults([])

    const token = await getToken()
    axios.get(`http://localhost:3000/persons/search/${query}`, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then(response => {
      console.log('Query:', query);
      console.log('Search results:', response.data);
      setResultBox(response.data)
      setResults(response.data)
    })
    .catch(error => {
      console.error('Error during search:', error);
      alert('Failed to perform search. Please try again.')
    });
  }
  
  return (
    <div className='m-10'>

        <h1>Search for Individual </h1>

        <div className="flex gap-5 mb-2">
          <p className="mt-1">Name:</p>
          <input 
            className="border border-gray-300 rounded-md p-2" 
            type="text" />
        </div>

        <div className="flex gap-5 mb-2">
          <p className="mt-1">National ID No:</p>
          <input 
            className="border border-gray-300 rounded-md p-2" 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}/>
        </div>

        <div className='mb-10'>
          <button 
            className='border p-2' onClick={submitRequest}>search</button>
        </div>

        {resultBox && (
          <div>
          <h1>SEARCH RESULTS</h1>
          <p className='font-bold'>BASIC INFO:</p>
          {results.map(person => (
            <div key={person.id}>
              <p>{person.full_name}</p>
              <p>{person.national_id}</p>
              <p>{person.dob}</p>
              <p>{person.gender}</p>
              <p>{person.nationality}</p>
              <p>{person.occupation}</p>
              <p className='font-bold'>OFFENSE</p>
               {person.offenses.map(offense => (
                  <div key={offense.id}>
                    <p>{offense.category}</p>
                    <p>{offense.conviction_status}</p>
                    <p>{offense.court}</p>
                    <p>{offense.case_number}</p>
                    <p>{offense.description}</p>
                    <p>{offense.severity}</p>
                  </div>
               ))}
            </div>
          ))}

          <div className='flex gap-5 mt-5'>
          </div>
        </div>)}

    </div>
  );
};

export default Search;


