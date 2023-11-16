import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { SuccessMsg } from '../../shared/errors';

type Prop = {
    pictures: string[];
	setPictures: any;
	setMainPicture: any;
	setError: any;
};

function PhotoUploader({ pictures, setPictures, setMainPicture, setError }: Prop) {
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
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image`,
                    formData,
                    { withCredentials: true },
                );
				if (response.data.message === SuccessMsg) {
					const newListImg = [...pictures, response.data.info];
					setPictures(newListImg);
					setMainPicture(response.data.infobis);
					setError('')
				}
				else {
					setError(response.data.error)
				}
				// info
            } catch {}
        }
    };

    return (
        <div className="relative w-32">
            <label htmlFor="update-avatar">
                Update avatar
               
            </label>
			<input
				id='update-avatar'
                    type="file"
                    accept="image/*"
                    className=""
                    onChange={handleImageChange}
                />
        </div>
    );
}

export default PhotoUploader;
