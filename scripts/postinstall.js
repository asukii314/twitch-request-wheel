const fs = require('fs-extra');

fs.chmod('./tests/test.sh', 0o755, (err) => {
    if (err) {
        console.log('Error adding execute permission to ./tests/test.sh');
        throw err;
    }
});

var filesGenerated = false;

if (!fs.existsSync('.env') ) {
    filesGenerated = true;
    console.log(' - Creating missing .env file');
	fs.writeFileSync('.env', `## Add your Twitch client id and secret key below
REACT_APP_TWITCH_CLIENT_ID=
REACT_APP_TWITCH_CLIENT_SECRET=

## Don't forget to update the urls below!
REACT_APP_REDIRECT_URI=https://asukii314.github.io/twitch-request-wheel/%23
REACT_APP_REDIRECT_URI_NOENCODE=https://asukii314.github.io/twitch-request-wheel/#`);
    console.log('   ...done!');
}

if (!fs.existsSync('.env.local') ) {
    filesGenerated = true;
    console.log(' - Creating missing .env.local file');
	fs.writeFileSync('.env.local', `## Add your Twitch client id and secret key below
REACT_APP_TWITCH_CLIENT_ID=
REACT_APP_TWITCH_CLIENT_SECRET=

REACT_APP_REDIRECT_URI=http://localhost:3000/%23
REACT_APP_REDIRECT_URI_NOENCODE=http://localhost:3000/#`);
    console.log('   ...done!');
}

if (filesGenerated === true) {
    console.log('\nDon\'t forget to update the generated .env file(s) with your Twitch client id and secret key!');
}
