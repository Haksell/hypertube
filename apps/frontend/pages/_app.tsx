import { UserProvider } from '../src/context/UserContext'
import { appWithTranslation } from 'next-i18next';
import '../styles/global.css'
import React from 'react'

function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    )
}

export default appWithTranslation(MyApp);