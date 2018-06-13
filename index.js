import * as SDK from 'microsoft-speech-browser-sdk';
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// View Engine
// app.set('view engine','ejs');
// app.set('views',path.join(__dirname,'views'));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// set static path
app.use(express.static(path.join(__dirname,'public')));
// app.use('/', router);
// app.use(express.static('public'));

app.get('/',function(req, res){
	// res.send('public');
});
app.get('/api/messages',function(req, res){
	res.send(hello);
});

app.listen(3000, function(){
	console.log("server at 3000");
});
