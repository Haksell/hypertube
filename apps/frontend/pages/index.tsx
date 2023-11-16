import axios from 'axios'
import { log } from 'logger'
import React from 'react'
import { CounterButton, Link } from 'ui'

export const metadata = {
    title: 'Store | Kitchen Sink',
}

export default function Store(): JSX.Element {
    log('Hey! This is the Store page.')

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
                Email: mail,
                Password: pwd,
            })
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const register = async () => {
        try {
            const uname = 'tonio'
            const mail = 'tonio@example.com'
            const pwd = 'Tonio'
            const res = await axios.post('http://localhost:5001/auth/register', {
                Username: uname,
                Email: mail,
                Password: pwd,
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
        </>
    )
}
