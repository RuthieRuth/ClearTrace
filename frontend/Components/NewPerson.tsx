import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { useState } from 'react'

const NewPerson = () => {
    const [fullname, setFullname] = useState('')
    const [nationalId, setNationalId] = useState ('')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState('')
    const [nationality, setNationality] = useState('')
    const [occupation, setOccupation] = useState('')
    const [address, setAddress] = useState('')
    const [photo, setPhoto] = useState('')
    const [offenseCategory, setOffenseCategory] = useState('')
    const [severity, setSeverity] = useState('')
    const [dateOfOffense, setDateOfOffense] = useState('')
    const [convictionStatus, setConvictionStatus] = useState('')
    const [court, setCourt] = useState('')
    const [caseNumber, setCaseNumber] = useState('')
    const [description, setDescription] = useState('')
    const [confirmationBox, setConfirmationBox] = useState(false)
    const { getToken } = useAuth()

    const resetForm = () => {
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
    }
    
    const confirmNewPerson = () => {
        setConfirmationBox(true)
    }

    const submitNewEntry = async () => {
       
       const token = await getToken()
       try{
            // sending two separate POST requests to create person and offense entries
        const getPerson= await axios .post('http://localhost:3000/persons', {
                full_name: fullname,
                national_id_no: nationalId,
                dob: dob,
                gender, 
                nationality,
                occupation,
                address,
                photo_url: photo,
        }, { headers: { Authorization: `Bearer ${token}` } })

            const personId =  getPerson.data.id;
        
        await axios.post('http://localhost:3000/offenses', {
            category: offenseCategory,
            severity,
            date_of_offense: dateOfOffense,
            conviction_status: convictionStatus,
            court,
            case_number: caseNumber,
            description,
            person_id: personId
        }, { headers: { Authorization: `Bearer ${token}` } })
        setConfirmationBox(false)
        alert('Entry saved successfully')
        resetForm()
        }
       catch (error) {
        console.error('Error response:', error);
                alert(`Failed to save entries: ${error}`);
       }
    }

    const cancelEntry = () => {
        setConfirmationBox(false)
    }

  return (
    <div className="p-6">

      <div className="p-6 mb-6">
        <h1 className='font-semibold text-lg mb-4 text-center'>Personal Details</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Full Name</label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Photo URL <span className='text-gray-400 font-normal'>(optional)</span></label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={photo} onChange={(e) => setPhoto(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">National ID Number</label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Date of Birth</label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Gender <span className='text-gray-400 font-normal'>(optional)</span></label>
            <select className="border border-gray-300 rounded-md p-2" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">-- select --</option>
              <option>male</option>
              <option>female</option>
              <option>other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Nationality <span className='text-gray-400 font-normal'>(optional)</span></label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Address <span className='text-gray-400 font-normal'>(optional)</span></label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Occupation <span className='text-gray-400 font-normal'>(optional)</span></label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="p-6 mb-6">
        <h1 className='font-semibold text-lg mb-4 text-center'>Offense Details</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Offense Category</label>
            <select className="border border-gray-300 rounded-md p-2" value={offenseCategory} onChange={(e) => setOffenseCategory(e.target.value)}>
              <option value="">-- select --</option>
              <option value="offenses_against_person">Offenses Against Person</option>
              <option value="offenses_against_property">Offenses Against Property</option>
              <option value="offenses_against_public_order">Offenses Against Public Order</option>
              <option value="offenses_against_state">Offenses Against State</option>
              <option value="narcotic_offenses">Narcotic Offenses</option>
              <option value="sexual_offenses">Sexual Offenses</option>
              <option value="offenses_involving_minors">Offenses Involving Minors</option>
              <option value="economic_and_financial_offenses">Economic and Financial Offenses</option>
              <option value="cybercrime_offenses">Cybercrime Offenses</option>
              <option value="road_traffic_offenses">Road Traffic Offenses</option>
              <option value="immigration_offenses">Immigration Offenses</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Severity</label>
            <select className="border border-gray-300 rounded-md p-2" value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="">-- select --</option>
              <option>low</option>
              <option>medium</option>
              <option>high</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Date of Offense</label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={dateOfOffense} onChange={(e) => setDateOfOffense(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Conviction Status</label>
            <select className="border border-gray-300 rounded-md p-2" value={convictionStatus} onChange={(e) => setConvictionStatus(e.target.value)}>
              <option value="">-- select --</option>
              <option>convicted</option>
              <option>acquitted</option>
              <option>pending</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Court <span className='text-gray-400 font-normal'>(optional)</span></label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={court} onChange={(e) => setCourt(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Case Number <span className='text-gray-400 font-normal'>(optional)</span></label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <label className="font-medium">Description <span className='text-gray-400 font-normal'>(optional)</span></label>
            <input className="border border-gray-300 rounded-md p-2" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
      </div>

      <div className='flex justify-end'>
        <button className='border p-2 px-6 bg-gray-100 hover:bg-green-400 rounded' onClick={confirmNewPerson}>SAVE</button>
      </div>

      {confirmationBox && (
        <div className="bg-slate-300/50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-80">
            <h1 className="font-semibold mb-2">Confirm Save</h1>
            <p className="text-gray-600 mb-6">Are you sure you want to save this entry?</p>
            <div className='flex gap-3 justify-end'>
              <button className='border p-2 px-4 hover:bg-green-400 rounded' onClick={submitNewEntry}>Confirm</button>
              <button className='border p-2 px-4 hover:bg-gray-100 rounded' onClick={cancelEntry}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewPerson

