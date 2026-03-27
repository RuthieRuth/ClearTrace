// this is for government to search for individuals
'use client'
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { get } from 'http';
import React, { useState } from 'react'

const Search = () => {
  const [resultBox, setResultBox] = useState(null)
  const [query, setQuery] = useState('')
  const { getToken } = useAuth()
  const [results, setResults] = useState<any[]>([])
  const [newOffense, setNewOffense] = useState(false) // new offense form state
  const [offenseCategory, setOffenseCategory] = useState('')
  const [severity, setSeverity] = useState('')
  const [dateOfOffense, setDateOfOffense] = useState('')
  const [convictionStatus, setConvictionStatus] = useState('')
  const [court, setCourt] = useState('')
  const [caseNumber, setCaseNumber] = useState('')
  const [description, setDescription] = useState('')
  const[selectedPersonId, setSelectedPersonId] = useState('')
  
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

  /* const resetForm = () => {
        setFullname('')
        setNationalId('')
        setDob('')
        setGender('')
        setNationality('')
        setOccupation('')
        setAddress('')
        setPhoto('')
        setOffenseCategory('')
        setSeverity('')
        setDateOfOffense('')
        setConvictionStatus('')
        setCourt('')
        setCaseNumber('')
        setDescription('')
  } */

  const addNewOffenseForm = (personId: string) => {
    console.log('open form to add new offense for person with id:', personId)
    setSelectedPersonId(personId)
    setNewOffense(true)
  }

  const saveAddedOffense = async() => {
    console.log('save added offense for person with id:', selectedPersonId)
    const token = await getToken()

    try{
      await axios.post('http://localhost:3000/offenses', {
                category: offenseCategory,
                severity,
                date_of_offense: dateOfOffense,
                conviction_status: convictionStatus,
                court,
                case_number: caseNumber,
                description,
                person_id: selectedPersonId
            }, { headers: { Authorization: `Bearer ${token}` } })
        setNewOffense(false)
        alert('Offense added successfully')
        await submitRequest() // refresh search results to show newly added offense
        // resetForm()
      }
    catch (error) {
        console.error('Error response:', error);
                alert(`Failed to save entries: ${error}`);
    }
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
                <p className='font-bold'>OFFENSES</p>
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
                <div className='mb-10'>
                  <button className='border p-2' onClick={() => addNewOffenseForm(person.id)}>Add New Offense</button>
                </div>
              </div>
            ))}

            {newOffense && (
              <div>
                <h1>ADD NEW OFFENSE</h1>
                <p onClick={() => setNewOffense(false)}>close</p>

              <p>Offense Category:</p>
              <select className="border border-gray-300 rounded-md p-2"
                    value={offenseCategory}
                    onChange={(e) => setOffenseCategory(e.target.value)}>
                <option value="">-- select --</option>
                <option>violent</option>
                <option>financial</option>
                <option>drug_related</option>
                <option>minors</option>
                <option>travel</option>
                <option>cybercrime</option>
                <option>property</option>
              </select>

              <p>Severity:</p>
              <select className="border border-gray-300 rounded-md p-2"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}>
                <option value="">-- select --</option>
                <option>low</option>
                <option>medium</option>
                <option>high</option>
              </select>

              <p>Date of Offense:</p>
              <input className="border border-gray-300 rounded-md p-2" type="text" value={dateOfOffense} onChange={(e) => setDateOfOffense(e.target.value)} />

              <p>Conviction status:</p>
              <select className="border border-gray-300 rounded-md p-2"
                    value={convictionStatus}
                    onChange={(e) => setConvictionStatus(e.target.value)}>
                <option value="">-- select --</option>
                <option>convicted</option>
                <option>acquitted</option>
                <option>pending</option>
              </select>

              <p>Court <span className='text-gray-500'>(optional)</span>:</p>
              <input className="border border-gray-300 rounded-md p-2" type="text" value={court} onChange={(e) => setCourt(e.target.value)} />

              <p>Case number <span className='text-gray-500'>(optional)</span>:</p>
              <input className="border border-gray-300 rounded-md p-2" type="text" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} />

              <p>Description <span className='text-gray-500'>(optional)</span>:</p>
              <input className="border border-gray-300 rounded-md p-2" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

              <div className='mt-5'>
                <button 
                  className='border p-2'
                  onClick={saveAddedOffense}>Save Offense</button>
              </div>
            </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Search;


