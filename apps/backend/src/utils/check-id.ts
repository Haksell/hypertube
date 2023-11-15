export function isId(username: string): boolean {
	const usernamePattern = /^[a-zA-Z0-9]{10}$/;
	return usernamePattern.test(username);
}
