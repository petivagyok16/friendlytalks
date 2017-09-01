const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const authenticate = require('./../middleware/authenticate');

const UserSchema = require('../models/user');

router.get('/me', authenticate, (req, res) => {
	return res.status(200).json({
		message: 'Success',
		user: req.user	
	});
});

router.post('/signup', (req, res, next) => {

	const User = new UserSchema({
		username: req.body.username,
		email: req.body.email,
		password: passwordHash.generate(req.body.password),
		name: {
			first: req.body.name.first,
			last: req.body.name.last
		},
		city: req.body.city,
		pictureUrl: req.body.pictureUrl || 'https://unsplash.it/195/195/?random'
	});

	User.save((err, userDoc) => {
		if (err) {
			return res.status(404).json({
				title: 'An error occured',
				error: { message: 'Couldn\'t save that user for some reason.' }
			});
		}

		const userToReturn =
		{
			id: userDoc._id,
			email: userDoc.email,
			pictureUrl: userDoc.pictureUrl,
			username: userDoc.username,
			ratings: userDoc.ratings,
			relations: userDoc.relations,
			messages: userDoc.messages,
			name: userDoc.name,
			city: userDoc.city
		};
		

		User.generateAuthToken().then(token => {
			res.status(200).json({
				message: 'Success',
				user: userToReturn,
				token: token
			});
		});
	});
});

router.post('/signin', (req, res, next) => {

	UserSchema.findOne({ username: req.body.username }, (err, userDoc) => {
		const userToReturn = { id: userDoc._id, email: userDoc.email, pictureUrl: userDoc.pictureUrl, username: userDoc.username, ratings: userDoc.ratings, relations: userDoc.relations, messages: userDoc.messages, name: userDoc.name, city: userDoc.city };		

		if (err) {
			return res.status(404).json({
				title: 'An error occured',
				error: { message: 'Wrong credentials!' }
			});
		}

		if (!userDoc) {
			return res.status(404).json({
				title: 'No user found.',
				error: { message: 'That user does not exist!' }
			});
		}

		if (!passwordHash.verify(req.body.password, userDoc.password)) {
			return res.status(404).json({
				title: 'Could not sign you in',
				error: { message: 'Wrong credentials' }
			});
		}

		userDoc.generateAuthToken().then(token => {
			res.status(200).json({
				message: 'Success',
				user: userToReturn,
				token: token
			});
		});
	});
});

router.post('/logout', (req, res, next) => {
	let token = req.header('Authorization');
	
	UserSchema.findByToken(token).then(user => {
		if (!user) {
			return Promise.reject();
		}

		user.tokens = [];
		user.save((err, result) => {
			if (err) {
				return res.status(500).json({
					title: 'Database error',
					error: { message: 'Something went wrong during logout, try again later.' }
				});
			}
			return res.status(200).json(null);
		});
	})
	.catch(error => {
		return res.status(401).json({
			title: 'Unauthorized error!',
			error: { message: 'Authorization error! Try again.' }
		});
	});
});
	

module.exports = router;