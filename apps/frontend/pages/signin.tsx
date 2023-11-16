import UserAlreadySignedIn from '../components/auth/UserAlreadySignedIn'
import Button from '../components/elems/Button'
import { ErrorField } from '../components/elems/ErrorFields'
import LinkText from '../components/elems/LinkText'
import ShowErrorMessage from '../components/elems/ShowErrorMessage'
import TitleSmall from '../components/elems/TitleSmall'
import MainLayout from '../layouts/MainLayout'
import { EmailNotVerified, InvalidPassword, UnknownUsername } from '../src/shared/errors'
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'

function SignInPage() {
    const [username, setUsername] = useState<string>('')
    const [password, setpassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [styleErrorUsername, setStyleErrorUsername] = useState<boolean>(false)
    const [styleErrorPwd, setStyleErrorPwd] = useState<boolean>(false)
    const [styleError, setStyleError] = useState<boolean>(false)
    const router = useRouter()
    // const { user, loginUser } = useUserContext();
    const user = null

    useEffect(() => {
        if (styleError === false) return
        if (error === '' || error === EmailNotVerified) {
            setStyleErrorUsername(false)
            setStyleErrorPwd(false)
        } else if (error === UnknownUsername) {
            setStyleErrorUsername(true)
            setStyleErrorPwd(true)
        } else if (error === InvalidPassword) {
            setStyleErrorUsername(false)
            setStyleErrorPwd(true)
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

    function handleSignIn(event: any) {
        event.preventDefault()
        signInBackend()
    }

    async function signInBackend() {
        try {
            const response = await axios.post(
                `http://localhost:5001/auth/login`,
                {
                    Username: username,
                    Password: password,
                },
                {
                    withCredentials: true,
                },
            )
            console.log(response.data)
            if (response.data) {
                // loginUser(response.data.user);
                setError('')
                setStyleError(false)
                router.push('/')
            }
            return response.data
        } catch (error) {
            console.log(error)
            setStyleError(true)
            setError(error.response.data)
            // loginUser(null);
        }
    }

    return user ? (
        <UserAlreadySignedIn />
    ) : (
        <MainLayout>
            <TitleSmall text={'Sign in to your account'} />

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" onSubmit={handleSignIn}>
                    <ShowErrorMessage error={error} message={''} />
                    <ErrorField
                        name="username"
                        title="Username"
                        onBlur={handleOnChangeUsername}
                        styleError={styleErrorUsername}
                        setStyleError={setStyleErrorUsername}
                        init={username}
                    />
                    <ErrorField
                        name="password"
                        title="Password"
                        onBlur={handleOnChangePassword}
                        styleError={styleErrorPwd}
                        setStyleError={setStyleErrorPwd}
                        init={password}
                    />

                    <div>
                        <Button
                            text="Sign In"
                            type="submit"
                            stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
                    </div>
                </form>

                <LinkText firstText="Not a member?" linkText="Sign up" link="/signup" />
                <LinkText
                    firstText="Forgot password?"
                    linkText="Reset password"
                    link="/forgot"
                    space="1"
                />
            </div>
        </MainLayout>
    )
}

export default SignInPage
