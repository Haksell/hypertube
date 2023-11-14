import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'
import Button from './elems/Button';

type PropButtonLinkBar = {
	text: string;
    page: string;
    selected: boolean;
    block: boolean;
	currLink?: string;
	setCurrLink?: any;
}
function ButtonLinkNavBar({
    text,
    page,
    selected,
    block,
	currLink=null,
	setCurrLink,
}: PropButtonLinkBar) {
    let styleInit: string = `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${
        block && 'block'
    }`;
	const [style, setStyle] = useState<string>(styleInit);
	useEffect(() => {
		if (page.match(currLink)) {
			setStyle(`bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium ${
				block && 'block'
			}`)
		}
		else
			setStyle(`text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium`);
				// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currLink]);

	function handleChangePage(page: string) {
		// console.log(page)
		setCurrLink(page);
	}
    return (
		<>
        <Link href={page}>
            <p className={style} aria-current="page" onClick={() => handleChangePage(page)}>
                {text}
            </p>
        </Link>
		</>
    );
}
type PropLinkNavBar = {
	currLink: string;
	setCurrLink: any;
}
function LinkNavBar({currLink, setCurrLink}: PropLinkNavBar) {
	// const { user } = useUserContext();
	const user = null
	const profileLink: string = `/profile`; //${user?.id}
	
    return (
        <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
                <ButtonLinkNavBar
                    text="Profile"
					page={profileLink}
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
            </div>
        </div>
    );
}

function LogoNavBar() {
    return (
        <div className="flex flex-shrink-0 items-center">
            <img
                className="h-8 w-auto"
                src="/hyperlogo.png"
                alt="Matcha"
            />
        </div>
    );
}

function ButtonNotifications() {
	const router = useRouter();

	function handleClickNotif(event: any) {
		event.preventDefault();
		router.push('/notifications');
	}
    return (
        <button
            type="button"
            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
			onClick={handleClickNotif}
		>
            <span className="absolute -inset-1.5"></span>
            <span className="sr-only">View notifications</span>
            <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
            </svg>
			<NbNotif option='notif' />

        </button>
    );
}

function DropdownMenu() {
    // const { user } = useUserContext();
	const user = null
	const router = useRouter();

    useEffect(() => {
        // if (!user) setShowDropMenu(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
	
    return user ? (
		<Button
            text="Sign out"
            onClick={() => {
				router.push('/signout');
            }}
        />
    ) : (
        <Button
            text="Sign in"
            onClick={() => {
				router.push('/signin')
            }}
        />
    );
}

function NavBar() {
    const [showMenu, setShowMenu] = useState<boolean>(false);
	const [currLink, setCurrLink] = useState<string>('no');
	// const { user, verifUser } = useUserContext();
	const router = useRouter();
	const user = null
	// const location = router.pathname;

	useEffect(() => {
		// verifUser();
		// console.log(router.pathname)
		if (router.pathname.match('/profile'))
			setCurrLink('/profile');
		else if (router.pathname.match('/settings'))
			setCurrLink('/settings');
		else if (router.pathname.match('/find'))
			setCurrLink('/find');
		else if (router.pathname.match('/map'))
			setCurrLink('/map');
		else
			setCurrLink('no');
			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currLink]);

    let outside: boolean = false;
    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <LogoNavBar />
                        <LinkNavBar 
							currLink={currLink}
							setCurrLink={setCurrLink}
							/>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						{user && <ButtonChat />}
                        {user && <ButtonNotifications />}
						{user && <AskGeolocalisation />}
                        <DropdownMenu />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
