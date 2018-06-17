// Copyright 2018, Google, LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const {google} = require('googleapis');
const sampleClient = require('./sampleclient');
const sub = 'Hello';
const to = 'muyaoxu@usc.edu';
const body = 'This is a test email';
const name = 'Joe'

var {Email} = require('./emailModel.js');
var {mongoose} = require('./mongoose');

const gmail = google.gmail({
  version: 'v1',
  auth: sampleClient.oAuth2Client
});

function saveToDb(physicalAddr, email, sub, body) {
  var email = new Email({
    physicalAddr: physicalAddr,
    receiverEmail: email,
    subject: sub,
    body: body
  });
  email.save().then((doc) => {
    console.log('Sucessfully saved to database' + doc);
  }, (e) => {
    console.log(e);
  });
}

function sendEmail (sub, name, to, body) {
  // You can use UTF-8 encoding for the subject using the method below.
  // You can also just use a plain string if you don't need anything fancy.
  // const subject = '🤘 Hello 🤘';
  const subject = sub;
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    'From: Justin Beckwith <beckwith@google.com>',
    `To: ${name} <${to}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    `${body}`
    // 'So... <b>Hello!</b>  🤘❤️😎'
  ];
  const message = messageParts.join('\n');

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // Save this email to the database
  saveToDb('Los Angeles', to, sub, body);

  const res = gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: encodedMessage
    }
  }, (err, {data}) => {
    if (err) return console.log(err);
    // console.log(data);
    return data;
  });

  // console.log('Print outside' + res);
  // console.log(res.data);
  // return res.data;
}

const scopes = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];

if (module === require.main) {
  sampleClient.authenticate(scopes)
    .then(c => sendEmail(sub, name, to, body))
    .catch(console.error);
}

module.exports = {
  sendEmail,
  client: sampleClient.oAuth2Client
};
