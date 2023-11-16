import LinkText from '../elems/LinkText'
import TextPage from '../elems/TextPage'
import TitleSmall from '../elems/TitleSmall'
import TramePage from '../elems/TramePage'

function UserNotSignedIn() {
    return (
        <TramePage>
            <TitleSmall text={'You cannot be here...'} />
            <TextPage>
                <p>Please sign in or sign up to access this page !</p>
                <LinkText linkText="Sign In" link="/signin" space="1" />
            </TextPage>
        </TramePage>
    )
}

export default UserNotSignedIn
