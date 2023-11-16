import React, { useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Login42(): JSX.Element {

	const router = useRouter()

	useEffect(() => {
		const oauth = async () => {
			try {
				const url = new URL(window.location.href)
				const code = url.searchParams.get('code')
				console.log(code)
				if (code) {
					const res = await axios.post('http://localhost:5001/auth/42', {
						code: code,
					})
					console.log(res.data)
					// TODO: Save res.data in context

					// Redirect to home
					router.push('/')
				}
			} catch (error) {
				console.log(error)
			}
		}

		oauth()
	}, [])

	
	return (
		<>
			<h1>Login42</h1>
			<p>Redirecting...</p>
		</>
	)
}
