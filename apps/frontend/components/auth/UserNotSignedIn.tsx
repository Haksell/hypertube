import TitleSmall from '../elems/TitleSmall';
import LinkText from '../elems/LinkText';
import TramePage from '../elems/TramePage';
import TextPage from '../elems/TextPage';

function UserNotSignedIn() {
    return (
		<TramePage>
            <TitleSmall text={'You cannot be here...'} />
			<TextPage>
                <p>Please sign in or sign up to access this page !</p>
				<LinkText
                    linkText="Sign In"
                    link="/signin"
					space='1'
                />
			</TextPage>
		</TramePage>
    );
}

export default UserNotSignedIn;
