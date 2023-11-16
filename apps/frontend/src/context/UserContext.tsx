import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { TUserContext } from '../shared/user';

interface Prop {
    user: TUserContext | null;
    loginUser: (userData: TUserContext | null) => void;
    logoutUser: () => void;
	verifUser: () => void;
    updateUser: (userData: Partial<TUserContext>) => void;
}

export const UserContext = React.createContext<Prop>({
    user: null,
    loginUser: () => {},
    logoutUser: () => {},
	verifUser:() => {},
    updateUser: () => {},
});

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<TUserContext | null>(null);

    useEffect(() => {
        fetchUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

	const fetchUser = async () => {
		try {
			const response = await axios.get(`http://localhost:5001/users/me`, {
				withCredentials: true,
			});
			setUser(response.data.user);
		} catch (error: any) {
		}
	};

	const verifUser = () => {
        fetchUser();
    };

    const loginUser = (userData: TUserContext | null) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    const updateUser = (userData: Partial<TUserContext>) => {
        setUser((prevUser) => {
            if (prevUser) {
                return { ...prevUser, ...userData };
            }
            return null;
        });
    };

    return (
        <UserContext.Provider
            value={{ user, loginUser, logoutUser, verifUser, updateUser }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
