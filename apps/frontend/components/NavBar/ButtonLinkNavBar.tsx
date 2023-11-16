import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type PropButtonLinkBar = {
    text: string
    page: string
    selected: boolean
    block: boolean
    currLink?: string
    setCurrLink?: any
}
function ButtonLinkNavBar({
    text,
    page,
    selected,
    block,
    currLink = null,
    setCurrLink,
}: PropButtonLinkBar) {
    let styleInit: string = `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${
        block && 'block'
    }`
    const [style, setStyle] = useState<string>(styleInit)
    useEffect(() => {
        if (page.match(currLink)) {
            setStyle(
                `bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium ${
                    block && 'block'
                }`,
            )
        } else
            setStyle(
                `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium`,
            )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currLink])

    function handleChangePage(page: string) {
        console.log(page)
        setCurrLink(page)
    }
    return (
        <Link href={page}>
            <p className={style} aria-current="page" onClick={() => handleChangePage(page)}>
                {text} {page}
            </p>
        </Link>
    )
}

export default ButtonLinkNavBar
