import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import { ErrorField } from '../components/elems/ErrorFields';
import Button from '../components/elems/Button';
import {
    EmailNotVerified,
    InvalidPassword,
    SuccessMsg,
    UnknownUsername,
} from '../src/shared/errors';
import ShowErrorMessage from '../components/elems/ShowErrorMessage';
import UserAlreadySignedIn from '../components/auth/UserAlreadySignedIn';
import TitleSmall from '../components/elems/TitleSmall';
import LinkText from '../components/elems/LinkText';
import MainLayout from '../layouts/MainLayout';

function SignInPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setpassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [styleErrorUsername, setStyleErrorUsername] =
        useState<boolean>(false);
    const [styleErrorPwd, setStyleErrorPwd] = useState<boolean>(false);
    const [styleError, setStyleError] = useState<boolean>(false);
    // const navigate = useNavigate();
	const router = useRouter();
    // const { user, loginUser } = useUserContext();
	const user = null

    useEffect(() => {
        if (styleError === false) return;
        if (error === '' || error === EmailNotVerified) {
            setStyleErrorUsername(false);
            setStyleErrorPwd(false);
        } else if (error === UnknownUsername) {
            setStyleErrorUsername(true);
            setStyleErrorPwd(true);
        } else if (error === InvalidPassword) {
            setStyleErrorUsername(false);
            setStyleErrorPwd(true);
        }
        setStyleError(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, styleError]);

    function handleOnChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }
    function handleOnChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        setpassword(e.target.value);
    }

    function handleSignIn(event: any) {
        event.preventDefault();
        // console.log('username=' + username + ', pwd=' + password);
        signInBackend();
    }

    async function signInBackend() {
        try {
			const response = null
            // const response = await axios.post(
            //     `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/signin`,
            //     {
            //         username: username,
            //         password: password,
            //     },
            //     {
            //         withCredentials: true,
            //     },
            // );
            // console.log(response.data);
            if (response.data.message === SuccessMsg) {
                loginUser(response.data.user);
                setError('');
                setStyleError(false);
                // navigate('/');
				router.push('/')
            } else {
                setStyleError(true);
                setError(response.data.error);
            }
            return response.data;
        } catch (error) {
            loginUser(null);
        }
    }

    return user ? (
        <UserAlreadySignedIn />
    ) : (
		<MainLayout>
            <TitleSmall text={'Sign in to your account'} />

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" onSubmit={handleSignIn}>
                    <ShowErrorMessage
                        error={error}
                        message={'Impossible to log-in because '}
                    />
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

                <LinkText
                    firstText="Not a member?"
                    linkText="Sign up"
                    link="/signup"
                />
                <LinkText
                    firstText="Forgot password?"
                    linkText="Reset password"
                    link="/forgot"
					space='1'
                />
            </div>
		</MainLayout>
    );
}

export default SignInPage;
