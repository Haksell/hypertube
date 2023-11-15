import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from './elems/Button'

type PropButtonLinkBar = {
	text: string
	page: string
	selected: boolean
	block: boolean
	currLink?: string
	setCurrLink?: any
}
function ButtonLinkNavBar({
	text,
	page,
	selected,
	block,
	currLink,
	setCurrLink,
}: PropButtonLinkBar) {
	let styleInit: string = `text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${
		block && 'block'
	}`
	const [style, setStyle] = useState<string>(styleInit)
	useEffect(() => {
		if (page.match(currLink)) {
			setStyle(
				`bg-zinc-900 text-white rounded-md px-3 py-2 text-sm font-medium ${
					block && 'block'
				}`,
			)
		} else
			setStyle(
				`text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium`,
			)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currLink])

	function handleChangePage(page: string) {
		// console.log(page)
		setCurrLink(page)
	}
	return (
		<Link href={page}>
			<p className={style} aria-current="page" onClick={() => handleChangePage(page)}>
				{text}
			</p>
		</Link>
	)
}

type PropLinkNavBar = {
	currLink: string
	setCurrLink: any
}
function LinkNavBar({ currLink, setCurrLink }: PropLinkNavBar) {
	return (
		<div className="hidden sm:ml-6 sm:block">
			<div className="flex space-x-4">
				<ButtonLinkNavBar
					text="Profile"
					page="/profile"
					selected={true}
					block={false}
					currLink={currLink}
					setCurrLink={setCurrLink}
				/>
				<ButtonLinkNavBar
					text="Browsing"
					page="/find"
					selected={false}
					block={false}
					currLink={currLink}
					setCurrLink={setCurrLink}
				/>
				<ButtonLinkNavBar
					text="Map"
					page="/map"
					selected={false}
					block={false}
					currLink={currLink}
					setCurrLink={setCurrLink}
				/>
				<ButtonLinkNavBar
					text="Settings"
					page="/settings"
					selected={false}
					block={false}
					currLink={currLink}
					setCurrLink={setCurrLink}
				/>
				<ButtonLinkNavBar
					text="Movies"
					page="/movies"
					selected={false}
					block={false}
					currLink={currLink}
					setCurrLink={setCurrLink}
				/>
			</div>
		</div>
	)
}

function LogoNavBar() {
	return (
		<div className="flex flex-shrink-0 items-center">
			<img className="h-8 w-auto" src="/navbar_logo.png" alt="Matcha" />
		</div>
	)
}

function DropdownMenu() {
	// const { user } = useUserContext();
	const user = null
	const router = useRouter()

	useEffect(() => {
		// if (!user) setShowDropMenu(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

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
	const [showMenu, setShowMenu] = useState<boolean>(false)
	const [currLink, setCurrLink] = useState<string>('no')
	// const { user, verifUser } = useUserContext();
	const router = useRouter()
	const user = null
	// const location = router.pathname;

	useEffect(() => {
		// verifUser();
		// console.log(router.pathname)
		if (router.pathname.match('/profile')) setCurrLink('/profile')
		else if (router.pathname.match('/settings')) setCurrLink('/settings')
		else if (router.pathname.match('/find')) setCurrLink('/find')
		else if (router.pathname.match('/map')) setCurrLink('/map')
		else if (router.pathname.match('/movies')) setCurrLink('/movies')
		else setCurrLink('no')
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
