'use client'
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Dashboard() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
        if (!isLoaded || !isSignedIn) return
        const redirect = async () => {
            try {
                const token = await getToken()
                //console.log('token:', token)
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
                })
                //console.log('user:', response.data)
                const role = response.data.role
                if (role === 'superadmin') router.replace('/superadmin')
                else if (role === 'data_officer') router.replace('/data-officer')
                else if (role === 'agency_head' || role === 'agency_staff') router.replace('/agency')
                else if (role === 'company') router.replace('/company')
                else console.error('Unknown role:', role)
            } catch (error) {
                console.error('Redirect error:', error)
            }
        }
        redirect()
    }, [isLoaded, isSignedIn])


  return <p>Loading...</p>
}
