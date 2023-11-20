import { useUserContext } from '../../src/context/UserContext'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function Login42(): JSX.Element {
    const { loginUser } = useUserContext()
    const router = useRouter()
    const { method } = router.query

    const oauth = async () => {
        try {
            const url = new URL(window.location.href)
            const code = url.searchParams.get('code')
            console.log(code)
            console.log(method)
            if (code) {
                const res = await axios.post(
                    'http://localhost:5001/auth/' + method,
                    {
                        code: code,
                    },
                    {
                        withCredentials: true,
                    },
                )
                loginUser(res.data)
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (['42', 'github', 'facebook'].includes(method as string)) oauth()
    }, [method])

    return (
        <>
            <h1>Login</h1>
            <p>Redirecting...</p>
        </>
    )
}
