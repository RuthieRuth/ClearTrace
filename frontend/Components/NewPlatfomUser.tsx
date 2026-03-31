'use client'
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

type Props = {
  onClose: () => void;
};

const NewEntry = ({ onClose }: Props) => {
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [agencyType, setAgencyType] = useState('')
  const [confirmationBox, setConfirmationBox] = useState(false)
  const [offenseAccess, setOffenseAccess] = useState<string[]>([])

  const { getToken } = useAuth()

  const confirmNewEntry = () => {
    setConfirmationBox(true)
  }

  const selectOffenseAccess = (category: string) => {
    setOffenseAccess(prev => {
      const selectedScope = prev.includes(category) 
      ? prev.filter(c => c !== category)
      : [...prev, category]
      console.log('Selected offense categories:', selectedScope)
      return selectedScope
    })
  }

  const submitEntry = async () => {
    const token = await getToken()
    axios.post('http://localhost:3000/users',
      { full_name: fullname, username, password, role, agency_type: agencyType, offense_access: offenseAccess },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(response => {
        console.log('Entry saved successfully:', response.data);
        setConfirmationBox(false)
        onClose()
      })
      .catch(error => {
        console.error('Error saving entry:', error);
        alert('Failed to save entry. Please try again.')
        setConfirmationBox(false)
      });
  }

  const cancelEntry = () => {
    setConfirmationBox(false)
  }

  return (
    <div className='m-10 border rounded-lg p-6 bg-white'>
      <p onClick={onClose} className="flex items-end justify-end mb-4 hover:underline">close</p>

      <h1 className="font-semibold">PERSONAL DETAILS</h1>
      <div className="flex gap-5 mb-2">
        <p className="mt-1">Full Name:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
      </div>

      <h1 className="font-semibold">ROLE AND ACCESS</h1>
      <div className="flex gap-5 mb-2 ">
        <p className="mt-1">Role:</p>
        <div className="grid">
          <select 
            className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
            value={role}
            onChange={(e) => setRole(e.target.value)}>
            <option value="">-- select --</option>
            <option value="government">government</option>
            <option value="company">company</option>
            <option value="superadmin">superadmin</option>
          </select>
        </div>
      </div>

      <div className="flex gap-5 mb-2 ">
        <p className="mt-5">Agency Type:</p>
        <div className="grid">
          <select 
            className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
            value={agencyType}
            onChange={(e) => setAgencyType(e.target.value)}>
            <option value="">-- select --</option>
            <option value="police">police</option>
            <option value="immigration">immigration</option>
            <option value="courts">courts</option>
            <option value="prison">prison</option>
            <option value="education">education</option>
            <option value="health">health</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mt-5">Offense Category Access</p>
        <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('offenses_against_person')} checked={offenseAccess.includes('offenses_against_person')} /> Offenses Against Person
          </label>
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('offenses_against_property')} checked={offenseAccess.includes('offenses_against_property')} /> Offenses Against Property
          </label>
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('offenses_against_public_order')} checked={offenseAccess.includes('offenses_against_public_order')} /> Offenses Against Public Order
          </label>
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('offenses_against_state')} checked={offenseAccess.includes('offenses_against_state')} /> Offenses Against State
          </label>
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('narcotic_offenses')} checked={offenseAccess.includes('narcotic_offenses')} /> Narcotic Offenses
          </label>
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('sexual_offenses')} checked={offenseAccess.includes('sexual_offenses')} /> Sexual Offenses
          </label>
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('offenses_involving_minors')} checked={offenseAccess.includes('offenses_involving_minors')} /> Offenses Involving Minors
          </label>
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('economic_and_financial_offenses')} checked={offenseAccess.includes('economic_and_financial_offenses')} /> Economic & Financial Offenses
          </label>
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('cybercrime_offenses')} checked={offenseAccess.includes('cybercrime_offenses')} /> Cybercrime Offenses
          </label>
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('road_traffic_offenses')} checked={offenseAccess.includes('road_traffic_offenses')} /> Road Traffic Offenses
          </label>
          <label>
            <input type="checkbox" onChange={() => selectOffenseAccess('immigration_offenses')} checked={offenseAccess.includes('immigration_offenses')} /> Immigration Offenses
          </label>
        </div>
      </div>
     

      <h1 className="font-semibold ">LOG IN DETAILS</h1>
      <div className="flex gap-5 mb-2">
        <p className="mt-1">Username:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <p className="mt-1">Password:</p>
        <input className="border border-gray-300 rounded-md p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className='mb-10'>
        <button className='border p-2' onClick={confirmNewEntry}>SAVE</button>
      </div>

      {confirmationBox && (
        <div>
          <h1 className="font-semibold">CONFIRM POPUP</h1>
          <p>Are you sure you want to save this entry?</p>
          <div className='flex gap-5 mt-5'>
            <button className='border p-2' onClick={submitEntry}>Confirm</button>
            <button className='border p-2' onClick={cancelEntry}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewEntry;
