
var mongoose = require('mongoose');

// name, schema
var Email = mongoose.model('Email', {
	physicalAddr: {
		type: String,
		minlength: 1,
		trim: true
	},
	receiverEmail: {
		type: String,
		minlength: 1,
		trim: true
	},
	subject: {
		type: String
	},
	body: {
		type: String
	}
});
module.exports = {Email};