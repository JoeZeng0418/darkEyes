// Copyright 2016, Google, Inc.
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

/**
 * This is used by several samples to easily provide an oauth2 workflow.
 */

const {google} = require('googleapis');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const opn = require('opn');
const destroyer = require('server-destroy');
const fs = require('fs');
const path = require('path');
const TOKEN_PATH = 'credentials.json';

const keyPath = path.join(__dirname, 'oauth2.keys.json');
let keys = { redirect_uris: [''] };
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}

class SampleClient {
  constructor (options) {
    this._options = options || { scopes: [] };

    // create an oAuth client to authorize the API call
    this.oAuth2Client = new google.auth.OAuth2(
  '1033489726868-fke9lb1bqhl4kmphu1h43sclqs8qjo3k.apps.googleusercontent.com',
  '7O67Gs6z4bhRryvZ1mdPZbmX',
  'http://localhost:3000/oauth2callback'
    );
  }

   getNewToken() {

  }

  // Open an http server to accept the oauth callback. In this
  // simple example, the only request to our webserver is to
  // /oauth2callback?code=<code>
   authenticate (scopes) {
    return new Promise((resolve, reject) => {
      // grab the url that will be used for authorization
      this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' ')
      });
      // check if we have previously stored a token
      fs.readFile(TOKEN_PATH, (err, tokens) => {
        // console.log('try to read file');
        if (err) {
          return  console.log('Cannot find file');
        }
        // console.log(tokens);
        this.oAuth2Client.credentials = JSON.parse(tokens);
        resolve(this.oAuth2Client);
      })
      // const server = http.createServer(async (req, res) => {
      //   try {
      //     if (req.url.indexOf('/oauth2callback') > -1) {
      //       const qs = querystring.parse(url.parse(req.url).query);
      //       res.end('Authentication successful! Please return to the console.');
      //       server.destroy();
      //       const {tokens} = await this.oAuth2Client.getToken(qs.code);
      //       this.oAuth2Client.credentials = tokens;
      //       // store the token to disk for later program executions
      //       console.log('begin to store user information');
      //       console.log(JSON.stringify(tokens));
      //       fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
      //         if (err) return console.log(err);
      //         console.log('Token stored to ', TOKEN_PATH);
      //       });
      //       resolve(this.oAuth2Client);
      //     }
      //   } catch (e) {
      //     reject(e);
      //   }
      // }).listen(3000, () => {
      //   // open the browser to the authorize url to start the workflow
      //   opn(this.authorizeUrl, {wait: false}).then(cp => cp.unref());
      // });
      // destroyer(server);
    });
  }
}

module.exports = new SampleClient();