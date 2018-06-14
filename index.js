const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

var app = express();


// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// set static path
app.use(express.static(path.join(__dirname,'public')));
// app.use('/', router);
// app.use(express.static('public'));

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
app.get('/api/end',function(req, res){
	removeAllAudio();
	res.send("deleted all audio files");
});
function removeAllAudio(){
	var directory = "public/assets/audio";
	fs.readdir(directory, (err, files) => {
	  if (err) throw err;

	  for (const file of files) {
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






