import ShowImg from './ShowImg'
import React from 'react'

type Prop = {
    pictures: string[]
    mainPicture: string
    setPictures: any
    setMainPicture: any
    setError: any
}

function ShowPictures({ pictures, mainPicture, setPictures, setMainPicture, setError }: Prop) {
    return (
        <div className="grid grid-cols-3 gap-3 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            {pictures.length === 0 ? 'No pictures yet. Upload one' : ''}
            {pictures.map((elem) => (
                <ShowImg picture={elem} setPicture={setPictures} setError={setError} key={elem} />
            ))}
        </div>
    )
}

export default ShowPictures
