import React from 'react';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';

type Prop = {
    picture: string;
	setPicture: any;
	setError: any;
};

function PhotoUploader({ picture, setPicture, setError }: Prop) {
    const [imageUpdate, setImageUpdate] = useState<string | null>(null);

    async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        const selectedImage = e.target.files?.[0];
        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUpdate(reader.result as string);
            };
            reader.readAsDataURL(selectedImage);
        }
		if (imageUpdate) {} //useless but for error management purpose

        if (selectedImage) {
            let formData = new FormData();

            formData.append('image', selectedImage);

            try {
                const response = await axios.post(
                    `http://localhost:5001/users/image`,
                    formData,
                    { withCredentials: true },
                );
				setPicture(response.data);
				setError('')
            } catch (error) {
				setError(error.response.data)
			}
        }
    };

    return (
		<>
		<input
				id='update-avatar'
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                /></>
	);
        // <div className="relative w-32">
            {/* <label htmlFor="update-avatar">
                Update avatar
            </label> */}
			// <input
			// 	id='update-avatar'
            //         type="file"
            //         accept="image/*"
            //         className=""
            //         onChange={handleImageChange}
            //     />
        // </div>
}

export default PhotoUploader;
