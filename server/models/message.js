var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var schema = new Schema({

	content: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	meta: {
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
	},
	user: { type: Schema.Types.ObjectId, ref: 'User' }

});

//post method means this should be fired after something. It has nothing to do with post request
//So after removing something do this:
schema.post('remove', function (doc) {
	var deletedMessage = doc;
	User.findById(doc.user, function (err, doc) {
		doc.messages.pull(deletedMessage);
		doc.save();
	});
});

module.exports = mongoose.model('Message', schema);


