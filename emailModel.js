
var mongoose = require('mongoose');

// name, schema
var Email = mongoose.model('Email', {
	subject: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
	physicalAddr: {
		type: String,
		minlength: 1,
		trim: true
	}
});
module.exports = {Email};



// var Todo = mongoose.model('Todo', {
// 	text: {
// 		type: String,
// 		required: true,
// 		minlength: 1,
// 		trim: true
// 	},
// 	completed: {
// 		type: Boolean,
// 		default: false
// 	}, 
// 	completedAt: {
// 		type: Number,
// 		default: null
// 	}
// });


// var newTodo = new Todo({
// 	text: 'Cook dinner'
// });


// newTodo.save().then((doc) => {
// 	console.log('Saved todo', doc);
// }, (e) => {
// 	console.log('Unable to save todo');
// });

// var otherTodo = new Todo({
// 	text: 'Feed the cat',
// 	completed: true,
// 	completedAt: 123
// });

// otherTodo.save().then((doc) => {
// 	console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
// 	console.log('Unable to save todo');
// });
