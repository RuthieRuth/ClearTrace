// this is for companies to search for individuals

'use client'

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

const RequestForm = () => {
  const [confirmationBox, setConfirmationBox] = useState(false)
  //const [personId, setPersonId] = useState("") 
  const [nationalId, setNationalId] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [purpose, setPurpose] = useState("")

  const [userToken, setUserToken] = useState("")
  const { getToken } = useAuth()


  // fetch specifically the company id
  useEffect(() => {
    const fetchUserToken = async () => {
      const token = await getToken()
      setUserToken(token ?? "")
      axios
        .get('http://localhost:3000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          // console.log(response.data)
          // console.log(response.data.company_id)
          // console.log(token)
          setCompanyId(response.data.company_id)
          setNationalId("") 
          setPurpose("") 
        })
    }
    fetchUserToken()
  }, [getToken])


/*   const confirmSearch = () => {
    console.log('search button clicked')

    // search for the person using the national id before submitting the request
    // you don't want requests for non-existent people cluttering the admin queue. 
    // The company should know upfront if the ID is invalid before submitting.
    axios
      .get(`http://localhost:3000/persons/search/${nationalId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      }) 
      .then(response => {
        console.log('Person found:', response.data)
        setConfirmationBox(true)
        setPersonId(response.data[0].id) // assuming the first result is the intended person
      })
      .catch(error => {
        console.error('Error searching for person:', error)
        alert('Failed to find person. Please check the national ID and try again.')
        setConfirmationBox(false)
      })
  } */

  const submitRequest = async () => {
    console.log('Submit button clicked')
    console.log(userToken)

   // const token = await getToken()

    // send to the appropiate endpoint(superadmin or data officer)
    axios.post('http://localhost:3000/requests',
      { national_id_no: nationalId, company_id: companyId, purpose: purpose },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    )
    .then(response => {
      console.log('Request submitted:', response.data)
      setConfirmationBox(false)
      alert('Request submitted successfully')
    })
    .catch(error => {
      console.error('Error submitting request:', error)
      alert('Failed to submit request. Please try again.')
      setConfirmationBox(false)
    })
  }

  const cancelRequest = () => {
    console.log('Cancel send button clicked')
    setConfirmationBox(false)
  }
  

  return (
    <div className='m-10'>

      <h1 className="mb-4">Application Form</h1>

        <div className="flex gap-5 mb-2">
          <p className="mt-1">National ID of Person:</p>
          <input 
            className="border border-gray-300 rounded-md p-2" 
            type="text" 
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />
        </div>

        <div className="flex gap-5 mb-2">
          <p className="mt-1">Purpose:</p>
          <input 
            className="border border-gray-300 rounded-md p-2" 
            type="text" 
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className='mb-10'>
          <button 
            className='border p-2' onClick={() => setConfirmationBox(true)}>Submit</button>
        </div>

        {confirmationBox && (
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6">
              <h1>Confirm Submission</h1>
              <p>You are about to send a request for *Name*.</p>
              <p>This will be logged</p>
              <div className='flex gap-5 mt-5'>
                <button className='border p-2' onClick={submitRequest}>confirm submission</button>
                <button className='border p-2' onClick={cancelRequest}>cancel</button>
              </div>
            </div>
          </div>)}

    </div>
  );
};

export default RequestForm;


