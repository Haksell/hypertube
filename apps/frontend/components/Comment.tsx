import { CommentDTO } from '../src/shared/comment'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface CommentProps extends CommentDTO {
    additionalClasses?: string
}

const Comment: React.FC<CommentProps> = (props: CommentProps) => {
    const router = useRouter()
    const initialLanguage = router.locale || router.defaultLocale || 'en'
    const { id, content, updatedAt, username, profilePicture, additionalClasses } = props

    const date = new Date(updatedAt)
    const longFormat = date.toLocaleString(initialLanguage, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
    })
    const abbreviatedFormat = date.toLocaleDateString(initialLanguage, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    return (
        <article
            className={'pt-6 mb-2 text-base bg-neutral-900 border-gray-700 ' + additionalClasses}
        >
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 font-semibold text-sm text-white">
                        <img
                            className="mr-2 w-6 h-6 rounded-full"
                            src={
                                profilePicture ||
                                'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png'
                            }
                            alt="Michael Gough"
                        />
                        {username}
                    </p>
                    <p className="text-sm text-gray-400">
                        <time dateTime={updatedAt} title={longFormat}>
                            {abbreviatedFormat}
                        </time>
                    </p>
                </div>
            </footer>
            <p className='mb-4'>{content}</p>
			<div className="flex gap-2">
				<button className='font-medium text-blue-500 hover:underline'>Edit</button>
				<button className='font-medium text-red-500 hover:underline'>Delete</button>
			</div>
        </article>
    )
}

export default Comment
