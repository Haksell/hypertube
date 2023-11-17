import React from "react";
import { useEffect, useState } from "react";
import ShowErrorMessage from "../components/elems/ShowErrorMessage";
import UserNotSignedIn from "../components/auth/UserNotSignedIn";
import MultiplesInputOneRow from "../components/elems/MultiplesInputOneRow";
import SelectInput from "../components/elems/SelectInput";
import axios from "axios";
import TitleSmall from "../components/elems/TitleSmall";
import { ErrorField } from "../components/elems/ErrorFields";
import Button from "../components/elems/Button";
import { TUserContext } from "../src/shared/user";
import { useUserContext } from "../src/context/UserContext";
import MainLayout from "../layouts/MainLayout";
import ShowImg from "../components/settings/ShowImg";

function SettingsPage() {
	const [error, setError] = useState<string>('');
	const { user } = useUserContext();
	
	//fields
    const [email, setEmail] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
	const [mainPicture, setMainPicture] = useState<string>('');

	useEffect(() => {
		getUserInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	async function getUserInfo() {
		try {
            const response = await axios.get(`http://localhost:5001/users/me`, {
                withCredentials: true,
            })
			setUserInfoForForm(response.data);
            return response.data
        } catch (error) {
			if (error.response)
				setError(error.response.data)
        }
	}

	function setUserInfoForForm(userInfo: TUserContext) {
		setEmail(userInfo.email);
		setFirstname(userInfo.firstName);
		setLastname(userInfo.lastName);
		setMainPicture(userInfo.picture);
	}

	async function saveUserInfo() {
		try {
            const response = await axios.post(
                `http://localhost:5001/users/updatesettings`,
                {
                    email: email,
                    lastname: lastname,
                    firstname: firstname,
                },
                {
                    withCredentials: true,
                },
            );
            setError('');
            return response.data;
        } catch (error) {
			if (error.response)
				setError(error.response.data);
        }
	}

    function handleOnChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }
    function handleOnChangeFirstname(e: React.ChangeEvent<HTMLInputElement>) {
        setFirstname(e.target.value);
    }
    function handleOnChangeLastname(e: React.ChangeEvent<HTMLInputElement>) {
        setLastname(e.target.value);
    }


	function handleSaveSettings(event: any) {
        event.preventDefault();
        saveUserInfo();
    }

	return !user ? (
        <UserNotSignedIn />
    ) : (
        <MainLayout>
            <TitleSmall text={'Settings'} space="1" />

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-2" action="#" onSubmit={handleSaveSettings}>
                    <ShowErrorMessage
                        error={error}
                        message={'Impossible to sign up because '}
                    />
                    <ErrorField
                        name="email1"
						type='email'
                        title="Email"
                        onBlur={handleOnChangeEmail}
						init={email}
                    />
					<MultiplesInputOneRow nbInRow="2">
						<ErrorField
							name="firstname"
							title="First name"
							onBlur={handleOnChangeFirstname}
							init={firstname}
						/>
						<ErrorField
							name="lastname"
							title="Last name"
							onBlur={handleOnChangeLastname}
							init={lastname}
						/>
					</MultiplesInputOneRow>

					<ShowImg
						picture={mainPicture}
						setPicture={setMainPicture}
						setError={setError}
                	/>

                    <Button
                        text="Amend your profile"
                        type="submit"
                        stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    />
                </form>

            </div>
        </MainLayout>
	);
}

export default SettingsPage;