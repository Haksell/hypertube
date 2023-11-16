import { TUserContext } from "../shared/user";

// Take a prisma User and return a TUserContext
export const formatUser = (user: any) : TUserContext => {
	return {
		id: user.user_id,
		username: user.username,
		email: user.email,
		authMethod: user.authMethod,
		firstName: user.firstName,
		lastName: user.lastName,
		picture: user.profile_picture,
	};
}