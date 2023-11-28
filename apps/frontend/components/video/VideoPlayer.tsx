import axios from 'axios'
import React, { useEffect, useRef } from 'react'

const VideoPlayer = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Requête GET pour récupérer le flux vidéo
                const response = await axios.get('http://localhost:5001/movies/view/tt0443649', {
                    responseType: 'arraybuffer',
					withCredentials: true,
                })

                // Convertir le flux en un objet blob
                const videoBlob = new Blob([response.data], { type: 'video/mp4' })

                // Créer une URL blob et l'assigner à la source vidéo
                const videoUrl = URL.createObjectURL(videoBlob)
                if (videoRef.current) {
                    videoRef.current.src = videoUrl
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du flux vidéo', error)
            }
        }

        fetchData()

        // Nettoyer l'URL blob lors du démontage du composant
        return () => {
            if (videoRef.current) {
                URL.revokeObjectURL(videoRef.current.src)
            }
        }
    }, [])

    return (
        <div>
            <video ref={videoRef} controls crossOrigin='use-credentials' width="600" height="400" />
        </div>
    )
}

export default VideoPlayer