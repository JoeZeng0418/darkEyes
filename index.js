const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// email function from send.js
const send = require('./send.js');
const sampleClient = require('./sampleclient');

var {Email} = require('./emailModel.js');
var {mongoose} = require('./mongoose');

var app = express();


// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// set static path
app.use(express.static(path.join(__dirname,'public')));
// app.use('/', router);
// app.use(express.static('public'));

// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
//  });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/',function(req, res){
	res.send('public');
});

app.get('/api/getAudio/query/:query',function(req, res){
	var text = req.params.query;
	// Creates a client
	const client = new textToSpeech.TextToSpeechClient();

	// The text to synthesize
	// const text = 'Hello, world! This is awesome Joe';

	// Construct the request
	const request = {
	  input: {text: text},
	  // Select the language and SSML Voice Gender (optional)
	  voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
	  // Select the type of audio encoding
	  audioConfig: {audioEncoding: 'MP3'},
	};

	// Performs the Text-to-Speech request
	client.synthesizeSpeech(request, (err, response) => {
	  if (err) {
	    console.error('ERROR:', err);
	    return;
	  }
	  var d = new Date();
	  var random_filename = d.getTime()+".mp3";
	  // Write the binary audio content to a local file
	  fs.writeFile('public/assets/audio/'+random_filename, response.audioContent, 'binary', err => {
	    if (err) {
	      console.error('ERROR:', err);
	      return;
	    }
	    console.log('Audio content written to file: '+random_filename);
	    res.send({
	    	'filename': random_filename
	    });
	  });
	});
});
app.get('/api/getMusic/:filename',function(req, res){
	// var rstream = fs.createReadStream("public/assets/audio/"+req.params.filename);
	if (fs.existsSync("public/assets/audio/"+req.params.filename)) {
		var rstream = fs.createReadStream("public/assets/audio/"+req.params.filename);
		console.log("sending "+req.params.filename+" through getMusic api");
	    rstream.pipe(res);
	} else {
		res.send("Error: no such file");
	}
});

app.get('/api/end',function(req, res){
	console.log("ending request from: "+req.hostname);
	removeAllAudio();
	res.send("deleted all audio files");
});

app.post('/api/sendEmail/:mailTo/:subject/:bodyText',function(req, res){
	console.log("sending email to "+req.params.mailTo);
	// sending email
	sampleClient.authenticate(send.scopes)
    .then(c => send.sendEmail(req.params.subject, "darkEyes", req.params.mailTo, req.params.bodyText))
    .catch(console.error);
    res.send({
    	'messgae': 'sent successfully'
    });
});

// helper
function removeAllAudio(){
	var directory = "public/assets/audio";
	fs.readdir(directory, (err, files) => {
	  if (err) throw err;

	  for (const file of files) {
	  	if (file=="askWho.mp3"||file=="askSubject.mp3"||file=="askBody.mp3"||file=="tellSent.mp3") {
	  		break;
	  	}
	    fs.unlink(path.join(directory, file), err => {
	      if (err) throw err;
	      console.log('successfully deleted '+file);
	    });
	  }
	});
}

app.listen(3000, function(){
	console.log("server at 3000");
});






