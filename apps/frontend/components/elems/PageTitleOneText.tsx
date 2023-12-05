import MainLayout from '../../layouts/MainLayout'
import LinkText from './LinkText'
import TextPage from './TextPage'
import TitleSmall from './TitleSmall'
import React from 'react'
import { useTranslation } from 'next-i18next'

type Prop = {
    title: string
    textBody: string
}

function PageTitleOneText({ title, textBody }: Prop) {
	const { t } = useTranslation('common')
    return (
        <MainLayout>
            <TitleSmall text={title} />
            <TextPage>
                <p>{textBody}</p>
                <LinkText linkText={t('getBack')} link="/" space="1" />
            </TextPage>
        </MainLayout>
    )
}

export default PageTitleOneText
