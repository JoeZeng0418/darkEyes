var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/DarkEyes', (err, db) => {
	if (err) {
		console.log("unable to connect to server");
	}
	console.log("connect successfully!");
});

module.exports = {mongoose};

