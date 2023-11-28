import axios from 'axios'
import React, { useEffect, useRef } from 'react'

const VideoPlayer = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null)

	// useEffect(() => {
	// 	const videoUrl = 'http://localhost:5001/movies/view/tt0443649';
	// 	const mediaSource = new MediaSource();
	
	// 	videoRef.current!.src = URL.createObjectURL(mediaSource);
	
	// 	const onDataAvailable = async (event: Event) => {
	// 	//   const sourceBuffer = mediaSource.addSourceBuffer('video/mp4');
	// 	  const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs=avc1.42E01E, mp4a.40.2');

	
	// 	//   const response = await fetch(videoUrl);
	// 	  const response = await axios.get('http://localhost:5001/movies/view/tt0443649', {
    //                 responseType: 'arraybuffer',
	// 				withCredentials: true,
    //             })

	// 	//   const videoBuffer = await response.arrayBuffer();
	// 	const videoBuffer = response.data
	
	// 	  sourceBuffer.addEventListener('updateend', () => {
	// 		if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
	// 		  mediaSource.endOfStream();
	// 		}
	// 	  });
	
	// 	  sourceBuffer.appendBuffer(videoBuffer);
	// 	};
	
	// 	mediaSource.addEventListener('sourceopen', onDataAvailable);
	
	// 	return () => {
	// 	  if (mediaSource.readyState === 'open') {
	// 		mediaSource.endOfStream();
	// 	  }
	// 	};
	//   }, []);
	

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
            } catch (error: any) {
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
