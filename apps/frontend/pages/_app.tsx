import React from 'react'
import { UserProvider } from '../src/context/UserContext'
import { appWithTranslation } from 'next-i18next';
import '../styles/global.css'
import { NextPage } from 'next';

interface MyAppProps {
	Component: NextPage;
	pageProps: Record<string, any>;
  }

  
function MyApp({ Component, pageProps }: MyAppProps) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    )
}

export default appWithTranslation(MyApp);