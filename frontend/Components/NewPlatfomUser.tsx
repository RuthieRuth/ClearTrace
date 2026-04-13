'use client'
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

type Props = {
  onClose: () => void;
  context?: 'agency' | 'company' | 'all';
};

interface AgencyTypeDefaults {
  [agencyType: string]: string[];
}

const agencyTypeDefaults: AgencyTypeDefaults = {
  police: ['offenses_against_person', 'offenses_against_property', 'offenses_against_public_order', 'offenses_against_state', 'narcotic_offenses', 'sexual_offenses', 'offenses_involving_minors', 'economic_and_financial_offenses', 'cybercrime_offenses', 'road_traffic_offenses', 'immigration_offenses'],  
  courts: ['offenses_against_person', 'offenses_against_property', 'offenses_against_public_order', 'offenses_against_state', 'narcotic_offenses', 'sexual_offenses', 'offenses_involving_minors', 'economic_and_financial_offenses', 'cybercrime_offenses', 'road_traffic_offenses', 'immigration_offenses'],
  prisons: ['offenses_against_person', 'offenses_against_public_order', 'offenses_against_state', 'narcotic_offenses', 'sexual_offenses', 'offenses_involving_minors'],
  education: ['offenses_against_person','offenses_against_public_order', 'narcotic_offenses', 'sexual_offenses', 'offenses_involving_minors'],
  health: ['narcotic_offenses', 'sexual_offenses', 'offenses_involving_minors'],
  immigration: ['offenses_against_state','narcotic_offenses','immigration_offenses'],
};


const NewEntry = ({ onClose, context='all' }: Props) => {
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [agencyType, setAgencyType] = useState('')
  const [confirmationBox, setConfirmationBox] = useState(false)
  const [offenseAccess, setOffenseAccess] = useState<string[]>([])
  const [companySelection, setCompanySelection] = useState('')
  const [agencyRole, setAgencyRole] = useState('')
  const [phone, setPhone] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [listCompanies, setListCompanies] = useState<[]>([])

  const { getToken } = useAuth()

  const confirmNewEntry = () => {
    setConfirmationBox(true)
  }

  // dropdowns for offense
  const selectOffenseAccess = (category: string) => {
    setOffenseAccess(prev => {
      const selectedScope = prev.includes(category) 
      ? prev.filter(c => c !== category)
      : [...prev, category]
      console.log('Selected offense categories:', selectedScope)
      return selectedScope
    })
  }

  const fetchCompanies = async () => {
    const token = await getToken()
    try {
      const response = await axios.get('http://localhost:3000/companies', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching companies:', error)
      return []
    }
  }

  const submitEntry = async () => {
    const token = await getToken()
    axios.post('http://localhost:3000/users',
      { full_name: fullname, username, password, role: role === 'agency' ? agencyRole : role, agency_type: agencyType, company_id: companyId || null, offense_access: offenseAccess },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(response => {
        console.log('Entry saved successfully:', response.data);
        alert('User saved successfully.')
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
      <div className="flex gap-5 mb-5">
        <p className="mt-1">Full Name:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
      </div>

      <h1 className="font-semibold">ROLE AND ACCESS</h1>
      <div className="flex gap-5 mb-2">
        <p className="mt-1">Role:</p>
        <div className="grid">
          <select 
            className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
            value={role}
            onChange={(e) => {
              setRole(e.target.value)
              setAgencyType('')
              setAgencyRole('')
              setOffenseAccess([])
              setCompanyId('') 
              if (e.target.value === 'company') {
                fetchCompanies()
                .then(companies => {
                  setListCompanies(companies)
                })
              }
            }}>
            <option value="">-- select --</option>
            {(context === 'all') && <option value="superadmin">Superadmin</option>}
            {(context === 'all' || context === 'agency') && <option value="data_officer">Data Officer</option>}
            {(context === 'all' || context === 'agency') && <option value="agency">Agency</option>}
            {(context === 'all' || context === 'company') && <option value="company">Company</option>}

          </select>
        </div>
      </div>
     
     {(role === 'agency') && (
        <div className="flex gap-5 mb-5 ">
          <p className="mt-5">Agency Type:</p>
          <div className="grid">
            <select 
              className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
              value={agencyType}
              onChange={(e) => {
                setAgencyType(e.target.value)
                setOffenseAccess(agencyTypeDefaults[e.target.value] ?? []) 
              }}>
              <option value="">-- select --</option>
              <option value="police">police</option>
              <option value="immigration">immigration</option>
              <option value="courts">courts</option>
              <option value="prisons">prisons</option>
              <option value="education">education</option>
              <option value="health">health</option>
            </select>
          </div>
        </div>
      )}

      {role === 'agency' && agencyType !== '' && (
        <div className="flex gap-5 mb-2">
          <p className="mt-1">Agency Role:</p>
          <label className="flex items-center gap-2">
            <input type="radio" name="agencyRole" value="agency_head" checked={agencyRole === 'agency_head'} onChange={(e) => setAgencyRole(e.target.value)} />
            Agency Head
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="agencyRole" value="agency_staff" checked={agencyRole === 'agency_staff'} onChange={(e) => setAgencyRole(e.target.value)} />
            Agency Staff
          </label>
        </div>
      )}

      {role === 'company' && (
        <div className="flex gap-5 mb-2">
          <p className="mt-1">Company ID:</p>
          <select 
              className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
              value={companySelection}
              onChange={(e) => {
                setCompanySelection(e.target.value)
              }}>
            <option value="">-- select --</option>
            {listCompanies.map((company: { id: string; name: string }) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>
      )}

      {agencyType && (
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
      )}
     

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
