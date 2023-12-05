import React, { useEffect, useRef } from 'react'

interface Prop {
    videoID: string
}
function VideoPlayer({ videoID }: Prop) {
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const link = `http://localhost:5001/movies/view/${videoID}`

    useEffect(() => {
        if (videoRef.current) videoRef.current.src = link
    }, [])

    return (
        <div className="video-wrapper">
            <video
                ref={videoRef}
                className="video-area"
                controls
                crossOrigin="use-credentials"
                width="600"
                height="400"
            >
                <source src={link} type="video/mp4" />
                <track label="English" kind="subtitles" srcLang="en" src={`http://localhost:5001/movies/subtitle/${videoID}?lang=en`} default />
				<track label="Francais" kind="subtitles" srcLang="fr" src={`http://localhost:5001/movies/subtitle/${videoID}?lang=fr`} default />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}

export default VideoPlayer
