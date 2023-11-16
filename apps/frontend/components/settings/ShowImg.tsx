import React from "react";
import axios from "axios";

type Prop = {
    picture: string; //picture to show
	pictures: string[]; //all pictures
    mainPicture: string; //main picture
	setPictures: any; 
	setMainPicture: any;
	setError: any;
};

function ShowImg({ picture, pictures, mainPicture, setPictures, setMainPicture, setError }: Prop) {
    const link: string = `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${picture}`;
	const altImage: string = `image description ${picture}`;
	async function deletePictureBackend() {
		try {
            const response = await axios.delete(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${picture}`,
                {
                    withCredentials: true,
                },
            );
            // console.log(response.data);
            setMainPicture(response.data)
			setError('');
            return response.data;
        } catch (error) {
			setError(error.response.data);
            //to handle ?
        }
	}

	function handleOnDeleteImg(event: any) {
        event.preventDefault();
        deletePictureBackend();
		const newPicturesUser: string[] = pictures.filter((elem) => elem !== picture)
		setPictures(newPicturesUser);
    }
    return (
        <div className="relative w-20">
            <img
                className="w-20 h-20 object-cover"
                src={link}
                alt={altImage}
            />
            <div className="group absolute top-0 left-0 w-full h-full opacity-0 transition-opacity hover:opacity-100">
                <label className="block text-sm font-semibold py-1 text-gray-900 dark:text-gray absolute bottom-0 left-0 w-full text-center bg-white bg-opacity-60 cursor-pointer">
                    Delete
                    <button className="hidden" onClick={handleOnDeleteImg}></button>
                </label>
            </div>
        </div>
    );
}

export default ShowImg;
