import React from "react";
import { useEffect, useState } from "react";
import ShowErrorMessage from "../components/elems/ShowErrorMessage";
import UserNotSignedIn from "../components/auth/UserNotSignedIn";
import MultiplesInputOneRow from "../components/elems/MultiplesInputOneRow";
import { DateInputField } from "../components/elems/DateInputField";
import SelectInput from "../components/elems/SelectInput";
import { TextareaField } from "../components/elems/TextareaField";
import axios from "axios";
import TitleSmall from "../components/elems/TitleSmall";
import { ErrorField } from "../components/elems/ErrorFields";
import Button from "../components/elems/Button";

function SettingsPage() {
	const [error, setError] = useState<string>('');
	const [user, setUser] = useState<User | null>(null);
	
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
		const retour: RetourType | null = await GetMe();
		if (!retour) {
			setError('Error')
			return ;
		}
		if (retour.message === SuccessMsg && retour.user) {
			setUser(retour.user);
			setUserInfoForForm(retour.user);
		}
		else
			setUser(null);
	}

	function setUserInfoForForm(userInfo: User) {
		setEmail(userInfo.email);
		setFirstname(userInfo.first_name);
		setLastname(userInfo.last_name);
		setMainPicture(userInfo.profile_picture);
	}

	async function saveUserInfo() {
		try {
            const response = await axios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/updatesettings`,
                {
                    email: email,
                    lastname: lastname,
                    firstname: firstname,
                },
                {
                    withCredentials: true,
                },
            );
            // console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setError('');
            } else {
                setError(response.data.error);
            }
            return response.data;
        } catch (error) {
            //to handle ? 
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
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
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

					<TextareaField name='biography' title="Biography" description="Write something about you here" onBlur={handleOnChangeBio} init={bio} />

					<ShowPictures pictures={pictures} mainPicture={mainPicture} setPictures={setPictures} setMainPicture={setMainPicture} setError={setError} />

					<PhotoUploader pictures={pictures} setPictures={setPictures} setMainPicture={setMainPicture} setError={setError} />

                    <Button
                        text="Amend your profile"
                        type="submit"
                        stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    />
                </form>

            </div>
        </div>
	);
}

export default SettingsPage;