var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: { type: String, required: true, trim: true, unique: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	tokens: [{
		access: { type: String, required: true },
		token: { type: String, unique: true }
	}],
	name: {
		first: { type: String, trim: true, required: true },
		last: { type: String, trim: true, required: true }
	},
	city: { type: String, trim: true, required: true },
	messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
	relations: {
		followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
	},
	ratings: {
		my: {
			likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
			dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
		},
		given: {
			likes: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
			dislikes: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
		}
	},
	pictureUrl: { type: String, required: true }
});

userSchema.plugin(mongooseUniqueValidator);



module.exports = mongoose.model('User', schema);