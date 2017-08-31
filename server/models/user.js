const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
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

UserSchema.plugin(mongooseUniqueValidator);

UserSchema.statics.findByToken = function(token) {
	let user = this;
	let decoded;

	try {
		decoded = jwt.verify(token, 'abc123');
	} catch (e) {
		return Promise.reject();
	}

	return user.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})
};

UserSchema.methods.generateAuthToken = function() {
	let user = this;
	let access = 'auth';
	let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens.push({ access, token });

	return user.save().then(() => {
		return token;
	});
};

module.exports = mongoose.model('User', UserSchema);