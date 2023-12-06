import MainLayout from '../layouts/MainLayout'
import React from 'react'

export default function Loading() {
    return (
        <MainLayout>
            <div>
                <img
                    src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/725eef121244331.60c1c7928b5dd.gif"
                    alt="loading"
                />
            </div>
        </MainLayout>
    )
}
