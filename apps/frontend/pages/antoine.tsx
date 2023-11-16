import React, { useEffect } from 'react'
import { log } from 'logger'
import axios from 'axios'

export const metadata = {
	title: 'Store | Kitchen Sink',
}

export default function Store(): JSX.Element {
	log('Hey! This is the Store page.')

	// check if there is a code in the params
	useEffect(() => {
		const oauth = async () => {
			try {
				const url = new URL(window.location.href)
				const code = url.searchParams.get('code')
				if (code) {
					const res = await axios.post('http://localhost:5001/auth/42', {
						code: code,
					})
					console.log(res.data)
				}
			} catch (error) {
				console.log(error)
			}
		}

		oauth()
	}, [])

	const sayHello = async () => {
		try {
			const res = await axios.get('http://localhost:5001/')
			console.log(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const login = async () => {
		try {
			const mail = 'tonio@example.com'
			const pwd = 'Tonio'
			const res = await axios.post('http://localhost:5001/auth/login', {
				email: mail,
				password: pwd,
			})
			console.log(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const register = async () => {
		try {
			const uname = 'tonio2'
			const mail = 'tonio2@example.com'
			const pwd = 'Tonio'
			const res = await axios.post('http://localhost:5001/auth/register', {
				username: uname,
				email: mail,
				password: pwd,
				firstName: 'Antoine',
				lastName: 'Bouquet',
			})
			console.log(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const test = async () => {
		try {
			const token = (document.getElementById('token') as HTMLInputElement).value
			const res = await axios.post('http://localhost:5001/test', { token: token })
			console.log(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<button onClick={sayHello}>Say Hello</button>
			<br />
			<button onClick={login}>Login user1</button>
			<br />
			<button onClick={register}>Register new user</button>
			<br />
			<input id="token" />
			<button onClick={test}>Test token</button>
			<br />
			<br />
			<a
				type="button"
				href="https://api.intra.42.fr/oauth/authorize?client_id=88ebd807f809ddd25f6b6aa15d8f0e5a08ea725b5bf5fc80143c9e225f6b5ecc&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code
"
			>
				Login 42
			</a>
		</>
	)
}
