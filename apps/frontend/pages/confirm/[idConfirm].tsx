import TextPage from '../../components/elems/TextPage'
import TitleSmall from '../../components/elems/TitleSmall'
import TramePage from '../../components/elems/TramePage'
import { ErMsg } from '../../src/shared/errors'
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'

function ConfirmEmailPage() {
    const router = useRouter()
    const { idConfirm } = router.query
    const [retour, setRetour] = useState<string | null>(null)
    const { t } = useTranslation('common')

    useEffect(() => {
        if (idConfirm) {
            validateLink()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idConfirm])

    async function validateLink() {
        if (!idConfirm) return
        try {
            const response = await axios.get(`http://localhost:5001/auth/confirm/${idConfirm}`, {
                withCredentials: true,
            })
            setRetour(response.data.msg)
            return response.data
        } catch (error) {
            if (error.response) {
                if (error.response.data === ErMsg('InvalidId', t)) router.push('/404')
                setRetour(error.response.data)
            } else setRetour(null)
        }
    }

    return (
        <TramePage>
            {retour && retour === ErMsg('SuccessMsg', t) && (
                <>
                    <TitleSmall text={'Congratulations'} />
                    <TextPage center={true}>Link validated. Please log in</TextPage>
                </>
            )}
            {retour && retour === 'already validated' && (
                <>
                    <TitleSmall text={'Error..'} />
                    <TextPage center={true}>Link already validated.</TextPage>
                </>
            )}
        </TramePage>
    )
}

export default ConfirmEmailPage
