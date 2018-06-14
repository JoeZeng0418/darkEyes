const {google} = require('googleapis');
const fs = require('fs');


const oauth2Client = new google.auth.OAuth2(
  '611055357315-s80cohgrjbvus07edvj0p1fqmcddq21n.apps.googleusercontent.com',
  'gmSY_LSKdFGMpLmwThetUo9V',
  'urn:ietf:wg:oauth:2.0:oob'
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});