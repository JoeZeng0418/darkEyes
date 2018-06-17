var {Todo} = require('./emailModel.js');
var {mongoose} = require('./mongoose');

	var todo = new Todo({
		text: 'We will see'
	});

	todo.save().then((doc) => {
		console.log(doc);
	}, (e) => {
		console.log(e);
	});