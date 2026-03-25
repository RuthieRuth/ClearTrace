import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import React, { useState } from 'react'

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
        const sendPost1= await axios .post('http://localhost:3000/persons', {
                full_name: fullname,
                national_id_no: nationalId,
                dob: dob,
                gender, 
                nationality,
                occupation,
                address,
                photo_url: photo,
        }, { headers: { Authorization: `Bearer ${token}` } })

            const personId =  sendPost1.data.id;
        
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
    <div>
        <h1 className='font-semibold'>Add New Person</h1>

        <p>Full name: </p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />

        <p>National ID number:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />

        <p>Date of Birth:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={dob} onChange={(e) => setDob(e.target.value)} />

        <div className="flex gap-5 mb-2 mt-2">
            <p>Gender <span className='text-gray-500'>(optional)</span>:</p>
            <select className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
                value={gender}
                onChange={(e) => setGender(e.target.value)}>
            <option value="">-- select --</option>
            <option>male</option>
            <option>female</option>
            <option>other</option>
            </select>
        </div>

        <p>Nationality <span className='text-gray-500'>(optional)</span>:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} />

        <p>Occupation <span className='text-gray-500'>(optional)</span>:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />

        <p>Address <span className='text-gray-500'>(optional)</span>:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />

        <p>Photo <span className='text-gray-500'>(optional)</span>:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={photo} onChange={(e) => setPhoto(e.target.value)} />
        

        <h1 className='font-semibold'>Offense Details</h1>

        <p>Offense Catergory</p>
        {/* <input className="border border-gray-300 rounded-md p-2" type="text" /> */}
        <select className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
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

        <div className="flex gap-5 mb-2 mt-2">
        <p>Severity:</p>
        <select className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}>
            <option value="">-- select --</option>
            <option>low</option>
            <option>medium</option>
            <option>high</option>
            </select>
        </div>

        <p>Date of Offense:</p>
        <input className="border border-gray-300 rounded-md p-2" type="text" value={dateOfOffense} onChange={(e) => setDateOfOffense(e.target.value)} />

        <p>Conviction status:</p>
        <select className="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ..."
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

        <div className='mb-10 mt-10'>
        <button className='border p-2' onClick={confirmNewPerson}>SAVE</button>
        </div>

        {confirmationBox && (
        <div>
          <h1 className="font-semibold">CONFIRM POPUP</h1>
          <p>Are you sure you want to save this entry?</p>
          <div className='flex gap-5 mt-5'>
            <button className='border p-2' onClick={submitNewEntry}>Confirm</button>
            <button className='border p-2' onClick={cancelEntry}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewPerson

