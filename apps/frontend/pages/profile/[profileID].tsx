import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../src/context/UserContext';
import { useRouter } from 'next/router';
import MainLayout from '../../layouts/MainLayout';
import TitleSmall from '../../components/elems/TitleSmall';
import PageTitleOneText from '../../components/elems/PageTitleOneText';
import UserNotSignedIn from '../../components/auth/UserNotSignedIn';
import { TUserProfile } from '../../src/shared/user';
import axios from 'axios';

function ProfilePage() {
    const { user } = useUserContext();
	const router = useRouter()
    const { profileID } = router.query
	const id: string = typeof profileID === 'string' ? profileID : ''
	const [userProfile, setUserProfile] = useState<TUserProfile | null>(null);
	const [idUser, setIdUser] = useState<number>(-1)
	const [blocked, setBlocked] = useState<boolean>(false);
	const [showReported, setShowReported] = useState<boolean>(true);
	const [visible, setVisible] = useState<string>('carousel-2.svg')
	
	useEffect(() => {
		setId();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		setId();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	useEffect(() => {
		setId();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	useEffect(() => {
		getUserInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idUser])

	function setId() {
		if (user && id) {
			const newId = parseInt(id)
			if (!isNaN(newId) && newId > 0) {
				setIdUser(newId);
			}
		}
		else if (user) {
			setIdUser(user.id)
		}
	}

	async function getUserInfo() {
		if (!(idUser > 0)) return ;
		try {
			const response = await axios.get(`http://localhost:5001/users/profile/${idUser}`, {
                withCredentials: true,
            })
			setUserProfile(response.data)
		}
		catch (error) {
			setUserProfile(null)
		}
	}

    return user ? (userProfile ? (
		<MainLayout>
			
            <TitleSmall text="Profile" space='1' />

			<div className="grid grid-rows-3 grid-cols-4 gap-1 lg:grid-rows-3 lg:grid-cols-4 lg:gap-1 sm:grid-rows-3 sm:grid-cols-1 sm:gap-4">
				<div className="row-start-1 row-end-4 col-span-3 lg:row-start-1 lg:row-end-4 lg:col-span-3 md:row-start-1 md:row-end-4">
					{/* <ImageCarrousel pictures={userM.pictures} visible={visible} setVisible={setVisible} /> */}
					{/* <img
						src={link}
						className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
						alt={altImg}
						onClick={onClickImg}
					/> */}
				</div>
				<div className="row-start-4 row-end-8 col-span-3 lg:row-start-1 lg:row-end-4 md:row-start-1 md:row-end-4">
					{/* <UserOptionProfile 
						userM={userM} 
						liked={liked} 
						setLiked={setLiked} 
						showReported={showReported} 
						setShowReported={setShowReported}
						blocked={blocked}
						setBlocked={setBlocked}
					/> */}
				</div>
				<div className="row-start-8 row-end-10 col-span-3 lg:row-start-6 lg:row-end-8 md:row-start-6 md:row-end-8">
					{/* <UserInfo user={userM} /> */}
				</div>
			</div>
			
        </MainLayout>
	) : (<PageTitleOneText
		title="User not found"
		textBody="It seems we couldn't found this user."
	/>)
    ) : (<UserNotSignedIn />);
}

export default ProfilePage;
