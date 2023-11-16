import { useEffect, useState } from "react";
import ShowErrorMessage from "../components/elems/ShowErrorMessage";
import UserNotSignedIn from "../components/auth/UserNotSignedIn";
import Button from "../components/elems/Button";
import { ErrorField } from "../components/elems/ErrorFields";
import LinkText from "../components/elems/LinkText";
import TitleSmall from "../components/elems/TitleSmall";
// import GetMe from "../components/backend/GetMe";
// import { User } from "../types/users";
import MultiplesInputOneRow from "../components/elems/MultiplesInputOneRow";
import { DateInputField } from "../components/elems/DateInputField";
import SelectInput from "../components/elems/SelectInput";
import { compute18Y, formatDateYYYYMMDD } from "../components/auth/ComputeAge";
import { TextareaField } from "../components/elems/TextareaField";
import { ShowTags } from "../components/settings/ShowTags";
import axios from "axios";
import { SuccessMsg } from "../shared/errors";
import PhotoUploader from "../components/settings/PhotoUpload";
import ShowPictures from "../components/settings/ShowPictures";
import CheckboxAskGeoModify from "../components/settings/CheckboxAskGeo";

function SettingsPage() {
	const [error, setError] = useState<string>('');
	const [user, setUser] = useState<User | null>(null);
	
	//fields
    const [email, setEmail] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
	const [datebirth, setDatebirth] = useState<string>('');
    const [gender, setGender] = useState<string>('female');
	const [bio, setBio] = useState<string>('');
	const [preference, setPreference] = useState<string>('bisexual');
	const [tagsUser, setTagsUser] = useState<string[]>([]);
	const [tagsAll, setTagsAll] = useState<string[]>([]);
	const [pictures, setPictures] = useState<string[]>([]);
	const [mainPicture, setMainPicture] = useState<string>('');
	const [longitude, setLongitude] = useState<string>('');
	const [latitude, setLatitude] = useState<string>('');
	const [amendPosition, setAmendPosition] = useState<boolean>(false);
	

	const [maxAge, setMaxAge] = useState<string>('');

	useEffect(() => {
		// setMaxAge(compute18Y());
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
			// console.log(retour);
			if (retour.tags)
				setTagsAll(retour.tags);
		}
		else
			setUser(null);
	}

	function setUserInfoForForm(userInfo: User) {
		setEmail(userInfo.email);
		setFirstname(userInfo.first_name);
		setLastname(userInfo.last_name);
		setTagsUser(userInfo.interests);
		setPreference(userInfo.preference);
		setBio(userInfo.biography);
		setPictures(userInfo.pictures);
		setMainPicture(userInfo.profile_picture);
		if (userInfo.date_birth)
			setDatebirth(formatDateYYYYMMDD(userInfo.date_birth));
		setGender(userInfo.gender);
		setLongitude(userInfo.position.longitude.toString());
		setLatitude(userInfo.position.latitude.toString());
		setAmendPosition(userInfo.force_position);
	}

	async function saveUserInfo() {
		try {
            const response = await axios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/updatesettings`,
                {
                    email: email,
                    lastname: lastname,
                    firstname: firstname,
                    datebirth: datebirth,
                    gender: gender,
					preference: preference,
					biography: bio,
					tags: tagsUser,
					amend_position: amendPosition,
					longitude: longitude,
					latitude: latitude,
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
	function handleOnChangeDateBirth(e: React.ChangeEvent<HTMLInputElement>) {
        setDatebirth(e.target.value);
    }
    function handleOnChangeGender(e: React.ChangeEvent<HTMLInputElement>) {
        setGender(e.target.value);
    }
	function handleOnChangePreference(e: React.ChangeEvent<HTMLInputElement>) {
        setPreference(e.target.value);
    }
	function handleOnChangeBio(e: React.ChangeEvent<HTMLInputElement>) {
        setBio(e.target.value);
    }
	function handleOnChangeLatitude(e: React.ChangeEvent<HTMLInputElement>) {
        setLatitude(e.target.value);
    }
	function handleOnChangeLongitude(e: React.ChangeEvent<HTMLInputElement>) {
        setLongitude(e.target.value);
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

					<DateInputField
							title="Date of birth"
							onBlur={handleOnChangeDateBirth}
							max={maxAge}
							init={datebirth}
						/>
					
					<MultiplesInputOneRow nbInRow="2">
						<ErrorField
							name="latitude"
							title="Latitude"
							onBlur={handleOnChangeLatitude}
							init={latitude}
							disabled={!amendPosition}
						/>
						<ErrorField
							name="longitude"
							title="Longitude"
							onBlur={handleOnChangeLongitude}
							init={longitude}
							disabled={!amendPosition}
						/>
					</MultiplesInputOneRow>

					<CheckboxAskGeoModify elemChecked={amendPosition} setElemChecked={setAmendPosition} />

					{/* <MultiplesInputOneRow nbInRow="2"> */}
						
						<SelectInput
							title="Gender"
							name="gender"
							nameDefault="Select gender"
							list={['female', 'male']}
							onBlur={handleOnChangeGender}
							init={gender}
						/>
						<SelectInput
							title="Sexual preference"
							name="preference"
							nameDefault="Select sexual preference"
							list={['female', 'male', 'bisexual']}
							onBlur={handleOnChangePreference}
							init={preference}
						/>
					{/* </MultiplesInputOneRow> */}

					<TextareaField name='biography' title="Biography" description="Write something about you here" onBlur={handleOnChangeBio} init={bio} />

					<ShowTags tagsUser={tagsUser} tagsPossible={tagsAll} setTagsUser={setTagsUser} />

					<ShowPictures pictures={pictures} mainPicture={mainPicture} setPictures={setPictures} setMainPicture={setMainPicture} setError={setError} />

					<PhotoUploader pictures={pictures} setPictures={setPictures} setMainPicture={setMainPicture} setError={setError} />

                    <Button
                        text="Amend your profile"
                        type="submit"
                        stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    />
                </form>

                <LinkText
                    firstText="Already a member?"
                    linkText="Sign in"
                    link="/signin"
                />
            </div>
        </div>
	);
}

export default SettingsPage;