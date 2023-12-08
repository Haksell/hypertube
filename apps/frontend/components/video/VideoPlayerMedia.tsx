import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { Readable } from 'stream'

// import fs from 'fs'

// responseType: 'arraybuffer',

function VideoPlayerMedia() {
    const videoRef = useRef(null)
    const link = 'http://localhost:5001/web/movies/view/tt0443649'

    useEffect(() => {
        void getVideo()
    }, [])

    async function getVideo() {
        try {
            const { Readable } = require('stream')
            const stream = new Readable({
                read() {},
            })

            const response = await axios.get<Readable>(link, {
                responseType: 'stream',
                withCredentials: true,
            })

            // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))

            // const videoElement = document.getElementById('video-player');

            // if (videoElement) {
            // 	// Utilisez le stream directement dans la balise vidéo
            // 	videoElement.srcObject = response.data;

            // 	// Autoplay la vidéo
            // 	videoElement.play();

            // }

            // console.log('response data')
            // console.log(response)

            response.data.pipe(stream)

            // const blobEvent: Blob = new Blob(response.data)

            // console.log('blob data')
            // console.log(blobEvent)
        } catch {}
    }

    return (
        <video ref={videoRef} width="600" height="400" controls autoPlay>
            <source src={link} type="video/mp4"></source>
            Browser does not support video tag
        </video>
    )
}

export default VideoPlayerMedia
