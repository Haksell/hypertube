import { appWithTranslation } from 'next-i18next';
import '../styles/global.css'
import React from 'react'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp);