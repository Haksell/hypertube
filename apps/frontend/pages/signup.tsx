import { compute18Y } from '../components/auth/ComputeAge'
import ConfirmUserCreation from '../components/auth/ConfirmUserCreation'
import UserAlreadySignedIn from '../components/auth/UserAlreadySignedIn'
import Button from '../components/elems/Button'
import { DateInputField } from '../components/elems/DateInputField'
import { ErrorField } from '../components/elems/ErrorFields'
import LinkText from '../components/elems/LinkText'
import SelectInput from '../components/elems/SelectInput'
import ShowErrorMessage from '../components/elems/ShowErrorMessage'
import TitleSmall from '../components/elems/TitleSmall'
import MainLayout from '../layouts/MainLayout'
// import { useUserContext } from '../context/UserContext';
import {
    EmailTaken,
    InvalidEmail,
    InvalidFirstName,
    InvalidLastName,
    InvalidUsername,
    MissingFirstName,
    MissingLastName,
    MissingPwd,
    MissingUsername,
    SuccessMsg,
    UsernameTaken,
} from '../src/shared/errors'
import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'

function SignUpPage() {
    const [username, setUsername] = useState<string>('')
    const [password, setpassword] = useState<string>('')
    const [email, setemail] = useState<string>('')
    const [firstname, setfirstname] = useState<string>('')
    const [lastname, setlastname] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [styleErrorUsername, setStyleErrorUsername] = useState<boolean>(false)
    const [styleErrorPwd, setStyleErrorPwd] = useState<boolean>(false)
    const [styleErrorEmail, setStyleErrorEmail] = useState<boolean>(false)
    const [styleErrorFirstname, setStyleErrorFirstname] = useState<boolean>(false)
    const [styleErrorLastname, setStyleErrorLastname] = useState<boolean>(false)
    const [styleError, setStyleError] = useState<boolean>(false)
    // const { user } = useUserContext();
    const user = null
    const [created, setCreated] = useState<boolean>(false)

    const [maxAge, setMaxAge] = useState<string>('')

    useEffect(() => {
        setMaxAge(compute18Y())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function setFalseAll() {
        setStyleErrorUsername(false)
        setStyleErrorPwd(false)
        setStyleErrorEmail(false)
        setStyleErrorFirstname(false)
        setStyleErrorLastname(false)
    }

    useEffect(() => {
        if (styleError === false) return
        if (error === '') setFalseAll()
        else {
            setFalseAll()
            if (error === InvalidUsername || error === MissingUsername || error === UsernameTaken)
                setStyleErrorUsername(true)
            else if (error === MissingPwd) setStyleErrorPwd(true)
            else if (error === EmailTaken || error === InvalidEmail) setStyleErrorEmail(true)
            else if (error === InvalidFirstName || error === MissingFirstName)
                setStyleErrorFirstname(true)
            else if (error === InvalidLastName || error === MissingLastName)
                setStyleErrorLastname(true)
        }
        setStyleError(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, styleError])

    function handleOnChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value)
    }
    function handleOnChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        setpassword(e.target.value)
    }
    function handleOnChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
        setemail(e.target.value)
    }
    function handleOnChangeFirstname(e: React.ChangeEvent<HTMLInputElement>) {
        setfirstname(e.target.value)
    }
    function handleOnChangeLastname(e: React.ChangeEvent<HTMLInputElement>) {
        setlastname(e.target.value)
    }

    function handleSignUp(event: any) {
        event.preventDefault()
        signUpBackend()
    }

    async function signUpBackend() {
        try {
            const response = await axios.post(
                `http://localhost:5001/auth/register`,
                {
                    Username: username,
                    Password: password,
                    Email: email,
                    LastName: lastname,
                    FirstName: firstname,
                },
                {
                    withCredentials: true,
                },
            )
            console.log(response.data)
            if (response.data.msg === SuccessMsg) {
                setError('')
                setStyleError(false)
                setCreated(true)
            } else {
                setStyleError(true)
                setError(response.data.error)
            }
            return response.data
        } catch (error) {
            // console.log(error)
            setStyleError(true)
            setError(error.response.data)
            //to handle ?
        }
    }

    return user ? (
        <UserAlreadySignedIn />
    ) : created ? (
        <ConfirmUserCreation />
    ) : (
        <MainLayout>
            <TitleSmall text={'Become a member !'} space="1" />

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-2" action="#" onSubmit={handleSignUp}>
                    <ShowErrorMessage error={error} message={'Impossible to sign up because '} />
                    <ErrorField
                        name="username"
                        title="Username"
                        onBlur={handleOnChangeUsername}
                        styleError={styleErrorUsername}
                        setStyleError={setStyleErrorUsername}
                        init={username}
                    />
                    <ErrorField
                        name="email"
                        title="Email"
                        onBlur={handleOnChangeEmail}
                        styleError={styleErrorEmail}
                        setStyleError={setStyleErrorEmail}
                        init={email}
                    />
                    <ErrorField
                        name="password"
                        title="Password"
                        onBlur={handleOnChangePassword}
                        styleError={styleErrorPwd}
                        setStyleError={setStyleErrorPwd}
                        init={password}
                    />
                    <ErrorField
                        name="firstname"
                        title="First name"
                        onBlur={handleOnChangeFirstname}
                        styleError={styleErrorFirstname}
                        setStyleError={setStyleErrorFirstname}
                        init={firstname}
                    />
                    <ErrorField
                        name="lastname"
                        title="Last name"
                        onBlur={handleOnChangeLastname}
                        styleError={styleErrorLastname}
                        setStyleError={setStyleErrorLastname}
                        init={lastname}
                    />

                    <div className="pt-5">
                        <Button
                            text="Sign Up"
                            type="submit"
                            stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
                    </div>
                </form>

                <LinkText firstText="Already a member?" linkText="Sign in" link="/signin" />
            </div>
        </MainLayout>
    )
}

export default SignUpPage
