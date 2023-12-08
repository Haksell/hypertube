const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

passport.use(
    'oauth2',
    new OAuth2Strategy(
        {
            authorizationURL: process.env.API_AUTHORIZATION_URL,
            tokenURL: process.env.API_TOKEN_URL,
            clientID: process.env.API_CLIENT_ID,
            clientSecret: process.env.API_CLIENT_SECRET,
            callbackURL: process.env.API_CALLBACK_URL,
        },
        (accessToken: string, refreshToken: string, profile: any, done: any) => {
            // You can customize this function to handle user creation/updating and storing tokens
            return done(null, profile);
        }
    )
);

module.exports = passport;