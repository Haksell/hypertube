import React from 'react';
import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { InvalidId, SuccessMsg } from '../../src/shared/errors';
import PageTitleOneText from '../../components/elems/PageTitleOneText';
import TramePage from '../../components/elems/TramePage';
import TitleSmall from '../../components/elems/TitleSmall';
import TextPage from '../../components/elems/TextPage';
import LinkText from '../../components/elems/LinkText';
import ShowErrorMessage from '../../components/elems/ShowErrorMessage';
import Button from '../../components/elems/Button';
import { ErrorField } from '../../components/elems/ErrorFields';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from 'next/router';

function ResetPasswordPage() {
	const router = useRouter()
    const { idConfirm } = router.query;
    const [retour, setRetour] = useState<string | null>(null);
    const [styleErrorPassword, setStyleErrorPassword] =
        useState<boolean>(false);
    const [created, setCreated] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
	

    useEffect(() => {
		console.log('id='+idConfirm)
        validateLink();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idConfirm]);

    async function validateLink() {
        if (!idConfirm) return;
        try {
            const response = await axios.get(
                `http://localhost:5001/auth/forgot/${idConfirm}`,
                {
                    withCredentials: true,
                },
            );
			if (response && response.data.msg)
            	setRetour(response.data.msg);
            // console.log(response.data);
            return response.data;
        } catch (error) {
			if (error.response === InvalidId)
				router.push('/404')
            setRetour(null);
        }
    }

    async function resetPasswordBackend() {
        try {
            const response = await axios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/forgot/${idConfirm}`,
                {
                    password: password,
                },
                {
                    withCredentials: true,
                },
            );
            // console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setError('');
                setStyleErrorPassword(false);
                setCreated(true);
            } else {
                setStyleErrorPassword(true);
                setError(response.data.error);
                setCreated(false);
            }
            return response.data;
        } catch (error) {
            //
        }
    }

    function handleOnChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    function handleSignIn(event: any) {
        event.preventDefault();
        resetPasswordBackend();
    }

    return retour && retour === SuccessMsg ? (
        created ? (
            <PageTitleOneText
                title="Password changed"
                textBody="You can now log in using your new password"
            />
        ) : (
            <MainLayout>
                <TitleSmall text={`Select a new password !`} />
                <TextPage>
                    <form
                        className="space-y-6"
                        action="#"
                        onSubmit={handleSignIn}
                    >
                        <ShowErrorMessage
                            error={error}
                            message={'Impossible to change password because '}
                        />
                        <ErrorField
                            name="password"
                            title="New password"
                            onBlur={handleOnChangePassword}
                            styleError={styleErrorPassword}
                            setStyleError={setStyleErrorPassword}
                        />

                        <div>
                            <Button
                                text="Change password"
                                type="submit"
                                stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            />
                        </div>
                    </form>

                    <LinkText linkText="Get back home" link="/" />
                </TextPage>
            </MainLayout>
        )
    ) : (
        <PageTitleOneText title="Oups..." textBody="Links not working here" />
    );
}

export default ResetPasswordPage;
