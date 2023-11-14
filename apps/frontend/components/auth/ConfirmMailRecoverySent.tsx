import TitleSmall from '../elems/TitleSmall';
import LinkText from '../elems/LinkText';
import TramePage from '../elems/TramePage';
import TextPage from '../elems/TextPage';

function ConfirmMailConfirmationSent() {
    return (
		<TramePage>
            <TitleSmall text={'Check your emails..'} />
			<TextPage>
                <p>A recovery link have been sent to your inbox.</p>
				<LinkText
                    linkText="Get back home"
                    link="/"
					space='1'
                />
			</TextPage>
		</TramePage>
    );
}

export default ConfirmMailConfirmationSent;
