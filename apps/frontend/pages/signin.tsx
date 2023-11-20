import UserAlreadySignedIn from '../components/auth/UserAlreadySignedIn'
import Button from '../components/elems/Button'
import { ErrorField } from '../components/elems/ErrorFields'
import LinkText from '../components/elems/LinkText'
import ShowErrorMessage from '../components/elems/ShowErrorMessage'
import TitleSmall from '../components/elems/TitleSmall'
import MainLayout from '../layouts/MainLayout'
import { ErMsg } from '../src/shared/errors'
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'
import { useUserContext } from '../src/context/UserContext'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

function SignInPage() {
    const [username, setUsername] = useState<string>('')
    const [password, setpassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [styleErrorUsername, setStyleErrorUsername] = useState<boolean>(false)
    const [styleErrorPwd, setStyleErrorPwd] = useState<boolean>(false)
    const [styleError, setStyleError] = useState<boolean>(false)
    const router = useRouter()
    const { user, loginUser } = useUserContext();
	const { t } = useTranslation('common')

    useEffect(() => {
        if (styleError === false) return
        if (error === '' || error === ErMsg('EmailNotVerified', t)) {
            setStyleErrorUsername(false)
            setStyleErrorPwd(false)
        } else if (error === ErMsg('UnknownUsername', t)) {
            setStyleErrorUsername(true)
            setStyleErrorPwd(true)
        } else if (error === ErMsg('InvalidPassword', t)) {
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
                    username: username,
                    password: password,
                },
                {
                    withCredentials: true,
                },
            )
            // console.log(response.data)
            if (response.data) {
				console.log('you are signed in!')
				console.log(response.data)
                loginUser(response.data);
				console.log('done')
                setError('')
                setStyleError(false)
                router.push('/')
            }
            return response.data
        } catch (error) {
            console.log(error)
            setStyleError(true)
            setError(error.response.data)
            loginUser(null);
        }
    }

    return user ? (
        <UserAlreadySignedIn />
    ) : (
        <MainLayout>
            <TitleSmall text={t('signin.signinTitle')} />
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" onSubmit={handleSignIn}>
                    <ShowErrorMessage error={error} message={''} />
                    <ErrorField
                        name="username"
                        title={t('username')}
                        onBlur={handleOnChangeUsername}
                        styleError={styleErrorUsername}
                        setStyleError={setStyleErrorUsername}
                        init={username}
                    />
                    <ErrorField
                        name="password"
                        title={t('password')}
                        onBlur={handleOnChangePassword}
                        styleError={styleErrorPwd}
                        setStyleError={setStyleErrorPwd}
                        init={password}
                    />

                    <div>
                        <Button
                            text={t('signIn')}
                            type="submit"
                            stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
                    </div>
                </form>

                <div className="mt-6">
                    <button
                        type="button"
                        className="flex w-full justify-center rounded-md px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <a
                            href="https://api.intra.42.fr/oauth/authorize?client_id=88ebd807f809ddd25f6b6aa15d8f0e5a08ea725b5bf5fc80143c9e225f6b5ecc&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin%2F42&response_type=code"
                            className="w-full text-center"
                        >
                            {t('signin.log42')}
                        </a>
                    </button>
                </div>

				<div className="mt-6">
                    <button
                        type="button"
                        className="flex w-full justify-center rounded-md px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <a
                            href="https://github.com/login/oauth/authorize?client_id=a8047e3e2d61515e6d2d&redirect_uri=http://localhost:3000/login%2Fgithub&scope=read:user"
                            className="w-full text-center"
                        >
                            {t('signin.logGit')}
                        </a>
                    </button>
                </div>

				<div className="mt-6">
                    <button
                        type="button"
                        className="flex w-full justify-center rounded-md px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <a
                            href="https://www.facebook.com/v18.0/dialog/oauth?client_id=2811827598960107&redirect_uri=http://localhost:3000/login%2Ffacebook&state=1234567890&scope=email"
                            className="w-full text-center"
                        >
                            {t('signin.logFb')}
                        </a>
                    </button>
                </div>

                <LinkText firstText={t('NAM')} linkText={t('signUp')} link="/signup" />
                <LinkText firstText={t('signin.forgot')} linkText={t('signin.reset')} link="/forgot" space="1" />
            </div>
        </MainLayout>
    )
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export default SignInPage;