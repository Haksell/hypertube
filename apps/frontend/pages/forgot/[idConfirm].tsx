import Button from '../../components/elems/Button'
import { ErrorField } from '../../components/elems/ErrorFields'
import LinkText from '../../components/elems/LinkText'
import PageTitleOneText from '../../components/elems/PageTitleOneText'
import ShowErrorMessage from '../../components/elems/ShowErrorMessage'
import TextPage from '../../components/elems/TextPage'
import TitleSmall from '../../components/elems/TitleSmall'
import TramePage from '../../components/elems/TramePage'
import MainLayout from '../../layouts/MainLayout'
import { ErMsg } from '../../src/shared/errors'
// import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

function ResetPasswordPage() {
    const router = useRouter()
    const { idConfirm } = router.query
    const [retour, setRetour] = useState<string | null>(null)
    const [styleErrorPassword, setStyleErrorPassword] = useState<boolean>(false)
    const [created, setCreated] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const { t } = useTranslation('common')

    useEffect(() => {
        console.log('id=' + idConfirm)
        validateLink()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idConfirm])

    async function validateLink() {
        if (!idConfirm) return
        try {
            const response = await axios.get(`http://localhost:5001/auth/forgot/${idConfirm}`, {
                withCredentials: true,
            })
            if (response && response.data.msg) setRetour(response.data.msg)
            // console.log(response.data);
            return response.data
        } catch (error: any) {
            if (error.response === ErMsg('InvalidId', t)) router.push('/404')
            setRetour(null)
        }
    }

    async function resetPasswordBackend() {
        try {
            const response = await axios.post(
                `http://localhost:5001/auth/forgot/${idConfirm}`,
                {
                    password: password,
                },
                {
                    withCredentials: true,
                },
            )
            // console.log(response.data);
            if (response.data.msg === ErMsg('SuccessMsg', t)) {
                setError('')
                setStyleErrorPassword(false)
                setCreated(true)
            } else {
                setStyleErrorPassword(true)
                setError(response.data.error)
                setCreated(false)
            }
            return response.data
        } catch (error: any) {
            setStyleErrorPassword(true)
			if (error.response)
            	setError(error.response.data)
            setCreated(false)
        }
    }

    function handleOnChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value)
    }

    function handleSignIn(event: any) {
        event.preventDefault()
        resetPasswordBackend()
    }

    return retour && retour === ErMsg('SuccessMsg', t) ? (
        created ? (
            <PageTitleOneText
                title={t('forgot2.pwdChange')}
                textBody={t('forgot2.newLog')}
            />
        ) : (
            <MainLayout>
                <TitleSmall text={t('forgot2.selectNewPwd')} />
                <TextPage>
                    <form className="space-y-6" action="#" onSubmit={handleSignIn}>
                        <ShowErrorMessage
                            error={error}
                            message={t('forgot2.noPwdChange')}
                        />
                        <ErrorField
                            name="password"
                            title={t('forgot2.newPwd')}
                            onBlur={handleOnChangePassword}
                            styleError={styleErrorPassword}
                            setStyleError={setStyleErrorPassword}
							init={password}
                        />

                        <div>
                            <Button
                                text={t('forgot2.changePwd')}
                                type="submit"
                                stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            />
                        </div>
                    </form>

                    <LinkText linkText={t('getBack')} link="/" />
                </TextPage>
            </MainLayout>
        )
    ) : (
        <PageTitleOneText title={t('forgot2.oups')} textBody={t('forgot2.linkDead')} />
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
      ...await serverSideTranslations(locale as string, ['common']),
    },
})

export default ResetPasswordPage