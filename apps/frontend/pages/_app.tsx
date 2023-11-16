import { UserProvider } from '../src/context/UserContext'
import '../styles/global.css'
import React from 'react'

export default function App({ Component, pageProps }) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    )
}
