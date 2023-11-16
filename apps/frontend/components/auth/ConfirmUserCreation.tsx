import LinkText from '../elems/LinkText'
import TextPage from '../elems/TextPage'
import TitleSmall from '../elems/TitleSmall'
import TramePage from '../elems/TramePage'

function ConfirmUserCreation() {
    return (
        <TramePage>
            <TitleSmall text={'Congratulations !'} />
            <TextPage>
                <p>Last steps.. Check your inbox to confirm your email !</p>
                <LinkText linkText="Get back home" link="/" space="1" />
            </TextPage>
        </TramePage>
    )
}

export default ConfirmUserCreation
