import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import React, { ReactNode } from 'react'

const MainLayout: React.FC<{ children?: ReactNode; className?: string; className2?: string }> = ({ children, className, className2 }) => {
    return (
        <div className={className}>
            <NavBar/>
                <div className={className2 || "flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"}>
                    {children}
                </div>
            <Footer/>
        </div>
    )
}

export default MainLayout
