import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import { useUserContext } from '../src/context/UserContext'

function SignOutPage() {
    const router = useRouter()
    const { logoutUser } = useUserContext();

    useEffect(() => {
        signOutBackend()
        logoutUser();
        router.push('/signin')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    async function signOutBackend() {
        try {
            const response = await axios.get(
                `http://localhost:5001/auth/signout/`,
                {
                    withCredentials: true,
                },
            )
            return response.data
        } catch (error: any) {
            logoutUser();
        }
    }
    return <></>
}

export default SignOutPage
