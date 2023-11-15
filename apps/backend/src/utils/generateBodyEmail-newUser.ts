export function generateEmailBodyNewUser(username: string, confirmID: string): string {
	return (`<b>Hey ${username}! </b><br>
	We are happy to have you here at MatchaLove42.<br>
	Please confirm your email using this link : <a href='http://${process.env.REACT_APP_SERVER_ADDRESS}:3000/confirm/${confirmID}'>
	http://${process.env.REACT_APP_SERVER_ADDRESS}:3000/confirm/${confirmID}</a> <br/>`)
}