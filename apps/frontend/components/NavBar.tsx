import Button from './elems/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useUserContext } from '../src/context/UserContext'
import LanguageSwitcher from './NavBar/LanguageSwitcher'
import { useTranslation } from 'next-i18next'

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
}> = ({ currLink, setCurrLink }) => {
    const { t } = useTranslation('common');

    return (
        <div className="flex items-center pt-2 ml-6 hidden sm:block">
            <div className="flex space-x-4">
                <ButtonLinkNavBar
                    text={t('navBar.profile')}
                    page="/profile"
                    currLink={currLink}
                    setCurrLink={setCurrLink}
                />
                <ButtonLinkNavBar
                    text={t('navBar.browsing')}
                    page="/find"
                    currLink={currLink}
                    setCurrLink={setCurrLink}
                />
                <ButtonLinkNavBar
                    text={t('navBar.settings')}
                    page="/settings"
                    currLink={currLink}
                    setCurrLink={setCurrLink}
                />
            </div>
        </div>
    );
};

const LogoNavBar = () => (
    <div className="flex flex-shrink-0 items-center pl-5">
        <Link href="/">
            <img className="h-12 w-auto" src="/navbar_logo.png" alt="Matcha" />
        </Link>
    </div>
)

const DropdownMenu = () => {
    const { user } = useUserContext()
    const router = useRouter()
    const { t } = useTranslation('common')

    return user ? (
        <Button
            text={t('navBar.signOut')}
            onClick={() => {
                router.push('/signout')
            }}
        />
    ) : (
        <Button
            text={t('signIn')}
            onClick={() => {
                router.push('/signin')
            }}
        />
    )
}

function MobileMenuBoutton({
    showMenu,
    setShowMenu,
}: {
    showMenu: boolean;
    setShowMenu: any;
}) {
    return (
        <div className="inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => {
                    setShowMenu(!showMenu);
                }}
            >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>

                <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </button>
        </div>
    );
}

type PropMobileMenuNavBar = {
	showMenu: boolean;
	currLink: string;
	setCurrLink: any;
}

function MobileMenu({ showMenu, currLink, setCurrLink }: PropMobileMenuNavBar) {
    const { t } = useTranslation('common');
    return showMenu ? (
        <>
            {/* <!-- Mobile menu, show/hide based on menu state. --> */}
            <div className="sm:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                    <ButtonLinkNavBar
                        text={t('navBar.profile')}
                        page="/profile"
                        currLink={currLink}
                        setCurrLink={setCurrLink}
                    />
                    <ButtonLinkNavBar
                        text={t('navBar.browsing')}
                        page="/find"
                        currLink={currLink}
                        setCurrLink={setCurrLink}
                    />
                    <ButtonLinkNavBar
                        text={t('navBar.settings')}
                        page="/settings"
                        currLink={currLink}
                        setCurrLink={setCurrLink}
                    />
                </div>
            </div>
        </>
    ) : null;
}



function NavBar() {
    const [showMenu, setShowMenu] = useState<boolean>(false);
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
			<div className="mx-auto max-w-7xl px-2 sm:pl-6 lg:pl-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="flex flex-1 sm:items-stretch sm:justify-start">
                        <MobileMenuBoutton
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                        />
						<LogoNavBar />
						<LinkNavBar currLink={currLink} setCurrLink={setCurrLink} />
					</div>
					<div className="inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6">
						<DropdownMenu />
					</div>
					<LanguageSwitcher/>
				</div>
			</div>
            <MobileMenu 
                showMenu={showMenu}
                currLink={currLink}
                setCurrLink={setCurrLink}
		    />
		</nav>
	)
}

export default NavBar