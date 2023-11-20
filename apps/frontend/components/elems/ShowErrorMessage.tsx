import React from 'react'
import { useTranslation } from 'next-i18next'

type Prop = {
    error: string
    message: string
}
function ShowErrorMessage({ error, message }: Prop) {
	const { t } = useTranslation('common')
    return error !== '' ? (
        <div className="brightness-100 text-rose-600 hover:brightness-150 border-slate-400 ">
            {message} {t(error)}
        </div>
    ) : (
        <></>
    )
}

export default ShowErrorMessage
