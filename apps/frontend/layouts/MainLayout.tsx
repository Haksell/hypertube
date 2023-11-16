import NavBar from '../components/NavBar'
import { UserProvider } from '../src/context/UserContext'
import React from 'react'

const MainLayout = ({ children }) => {
    return (
        <div>
            <NavBar />
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                {children}
            </div>
        </div>
    )
}

export default MainLayout
