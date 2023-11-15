import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TramePage from '../../components/elems/TramePage';
import TitleSmall from '../../components/elems/TitleSmall';
import TextPage from '../../components/elems/TextPage';
import { InvalidId, SuccessMsg } from '../../src/shared/errors';

function ConfirmEmailPage() {
	const router = useRouter()
	const { idConfirm } = router.query
    const [retour, setRetour] = useState<string | null>(null);

    useEffect(() => {
        if (idConfirm) {
            validateLink();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idConfirm]);

    async function validateLink() {
        if (!idConfirm) return;
        try {
            const response = await axios.get(
                `http://localhost:5001/auth/confirm/${idConfirm}`,
                {
                    withCredentials: true,
                },
            );
            setRetour(response.data.msg);
            return response.data;
        } catch (error) {
			if (error.response) {
				if (error.response.data === InvalidId)
					router.push('/404')
				setRetour(error.response.data)
			}
			else
            	setRetour(null);
        }
    }

    return (
        <TramePage>
            {retour && retour === SuccessMsg && (
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
    );

}

export default ConfirmEmailPage;
