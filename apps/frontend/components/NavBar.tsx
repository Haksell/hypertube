import Button from './elems/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const ButtonLinkNavBar: React.FC<{
    text: string
    page: string
    currLink: string
    setCurrLink: React.Dispatch<React.SetStateAction<string>>
}> = ({ text, page, currLink, setCurrLink }) => (
    <Link href={page}>
        <p
            className={`${
                page.match(currLink)
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
            } rounded-md px-3 py-2 text-sm font-medium`}
            aria-current="page"
            onClick={() => setCurrLink(page)}
        >
            {text}
        </p>
    </Link>
)

const LinkNavBar: React.FC<{
    currLink: string
    setCurrLink: React.Dispatch<React.SetStateAction<string>>
}> = ({ currLink, setCurrLink }) => (
    <div className="flex items-center ml-6">
        <div className="flex space-x-4">
            <ButtonLinkNavBar
                text="Profile"
                page="/profile"
                currLink={currLink}
                setCurrLink={setCurrLink}
            />
            <ButtonLinkNavBar
                text="Browsing"
                page="/find"
                currLink={currLink}
                setCurrLink={setCurrLink}
            />
            <ButtonLinkNavBar
                text="Map"
                page="/map"
                currLink={currLink}
                setCurrLink={setCurrLink}
            />
            <ButtonLinkNavBar
                text="Settings"
                page="/settings"
                currLink={currLink}
                setCurrLink={setCurrLink}
            />
        </div>
    </div>
)

const LogoNavBar = () => (
    <div className="flex flex-shrink-0 items-center">
        <Link href="/">
            <img className="h-12 w-auto" src="/navbar_logo.png" alt="Matcha" />
        </Link>
    </div>
)

const DropdownMenu = () => {
    const user = null // TODO
    const router = useRouter()

    return user ? (
        <Button
            text="Sign out"
            onClick={() => {
                router.push('/signout')
            }}
        />
    ) : (
        <Button
            text="Sign in"
            onClick={() => {
                router.push('/signin')
            }}
        />
    )
}

function NavBar() {
    const [currLink, setCurrLink] = useState<string>('no')
    const router = useRouter()

    useEffect(() => {
        if (router.pathname.match('/profile')) setCurrLink('/profile')
        else if (router.pathname.match('/settings')) setCurrLink('/settings')
        else if (router.pathname.match('/find')) setCurrLink('/find')
        else if (router.pathname.match('/map')) setCurrLink('/map')
        else if (router.pathname.match('/movies')) setCurrLink('/movies')
        else setCurrLink('no')
    }, [currLink])

    return (
        <nav className="bg-zinc-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <LogoNavBar />
                        <LinkNavBar currLink={currLink} setCurrLink={setCurrLink} />
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <DropdownMenu />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
