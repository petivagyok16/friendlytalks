const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const UserSchema = require('../models/user');
const authenticate = require('../middleware/authenticate');


router.get('/:userId', (req, res, next) => {

	const userId = req.params.userId;

	UserSchema.findById(userId, 'username messages name pictureUrl email city relations ratings')
		.exec((err, userDoc) => {

			if (err) {
				return res.status(404).json({
					title: 'An error occured! at [GET] profile/:userId',
					error: { message: 'Talk to the admin for more information please.' }
				});
			}

			if (!userDoc) {
				return res.status(404).json({
					title: 'Cannot find that user',
					error: { message: 'Cannot find that user' }
				});
			}

			if (userDoc) {
				const userToReturn = {
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
				
				res.status(200).json({
					message: 'Success',
					obj: userToReturn
				});
			} else {
				res.status(404).json({
					title: 'Not found.',
					error: { message: 'User not found!'}
				})
			}
		});
});

router.patch('/:id', authenticate, (req, res, next) => {
	console.log('follower user:' + req.params.id);

	console.log('followed user:' + req.body.toFollowId);
	//Finding the followed User to update its follower field
	//first element of the array is the follower user, second is the followed user
	//mongoose gives back in the same order hopefully. BELIEVE
	UserSchema.find({ _id: { $in: [req.params.id, req.body.toFollowId] } }, (err, docs) => {

		if (err) {
			return res.status(404).json({
				title: 'An error occurred! at [PATCH] profile/:id',
				error: { message: 'Talk to the admin for more information please.' }
			});
		}

		if (!docs) {
			return res.status(404).json({
				title: 'Error',
				error: { message: 'User cannot be found!' }
			});
		}

		//If mongoose is my friend he gives me back the users in the right order
		//*** UPDATE: Mongoose is not my friend, he gives back randomly. It was a pain in the ass to debug. ***

		/* THIS SOLUTION IS BAD!
		var followerUser = docs[0];
		var followedUser = docs[1]; */

		//It seems like this is the good one
		if (docs[0]._id == req.params.id) {

			var followerUser = docs[0];
			//console.log('FollowerUser: ' + followerUser);
			var followedUser = docs[1];
			//console.log('FollowedUser: ' + followedUser);

		} else {

			var followerUser = docs[1];
			//console.log('FollowerUser: ' + followerUser);
			var followedUser = docs[0];
			//console.log('FollowedUser: ' + followedUser);
		}

		//Updating the follower / following state of each user (the user who requested following the user
		//and the user who is followed.

		if (req.body.state === true) {

			followerUser.relations.following.push(req.body.toFollowId);
			followedUser.relations.followers.push(followerUser._id);

		} else {

			var index = followerUser.relations.following.indexOf(req.body.toFollowId);
			var indexOfFollowedUserFollower = followedUser.relations.followers.indexOf(followerUser._id);

			followerUser.relations.following.splice(index, 1);
			followedUser.relations.followers.splice(indexOfFollowedUserFollower, 1);
		}

		//Storing the followed user results in vars because
		//a middleware can send only 1 respond back :)
		var followedUserErr = null;
		//it seems like followedUserResult cannot be assigned to the result of the saving
		//operation in time, but its not a big deal atm.
		var followedUserResult = null;

		followedUser.save((err, result) => {

			if (err) {
				followedUserErr = err;
				console.log(followedUserErr);

				return res.status(404).json({
					title: 'Error!',
					error: { message: 'Followed user could not be stored. Talk to the admin please.' }
				});
			}

			followedUserResult = result; //it fails in terms of time i think

		});

		followerUser.$__save({}, (followerUserErr, followerUserResult) => {

			if (followerUserErr || followedUserErr) {
				return res.status(404).json({
					title: 'Error!',
					error: { message: 'An error occured during the following process.' }
				});
			}

			return res.status(200).json({
				message: 'Followings and Followers are updated',
				obj: {
					followerUserResult: followerUserResult,
					followedUserResult: followedUserResult //it will be null sometimes, cause followedUser.save() is too slow i think (not sure)
				}
			});
		});
	});
});

router.get('/followers/:userId', (req, res, next) => {

	var userId = req.params.userId;

	UserSchema.findById(userId)
		.populate('relations.followers', 'username email name pictureUrl')
		.exec((err, doc) => {
			if (err) {
				return res.status(404).json({
					title: 'An error occured! at [GET]follosers/:userId',
					error: 'Talk to the admin for more information please.'
				});
			}

			if (!doc) {
				return res.status(404).json({
					title: 'Error!',
					error: { message: 'Cannot find that user!' }
				});
			}

			res.status(200).json({
				message: 'Success',
				obj: doc.relations.followers
			});
		});
});

router.get('/following/:userId', (req, res, next) => {

	let userId = req.params.userId;

	UserSchema.findById(userId)
		.populate('relations.following', 'username email name pictureUrl')
		.exec((err, doc) => {
			if (err) {
				return res.status(404).json({
					title: 'An error occured! at [GET]/following/:userId',
					error: { message: 'Talk to the admin for more information please!' }
				});
			}

			if (!doc) {
				return res.status(404).json({
					title: 'Error!',
					error: { message: 'Cannot find that user!' }
				});
			}

			res.status(200).json({
				message: 'Success',
				obj: doc.relations.following
			});
		});
});

router.get('/followingmessages/:userId', (req, res, next) => {

	UserSchema.findById(req.params.userId, 'relations.following')
		.populate({
			path: 'relations.following',
			populate: { path: 'messages' }
		})
		.exec((err, doc) => {

			if (err) {
				return res.status(404).json({
					title: 'Error! at [GET]followingmessages/:userId',
					error: 'Talk to the admin for more information please!'
				});
			}

			res.status(200).json({
				message: 'Success',
				obj: doc.relations.following
			});
		});
});

router.patch('/editprofile/:id', authenticate, (req, res, next) => {
	let decoded = jwt.decode(req.token);
	
	UserSchema.findById(req.params.id, (err, doc) => {

		if (err) {
			return res.status(404).json({
				title: 'An error occurred! at [PATCH] editprofile/:id',
				error: { message: 'Talk to the admin for more information please!' }
			});
		}

		if (!doc) {
			return res.status(404).json({
				title: 'Cannot find that user',
				error: { message: 'Cannot find that user!' }
			});
		}

		if (doc._id != decoded._id) {
			return res.status(401).json({
				title: 'Not authorized!',
				error: { message: 'You are trying to change a different profile.' }
			});
		}

		doc.pictureUrl = req.body.pictureUrl;
		doc.email = req.body.email;
		doc.name.first = req.body.firstName;
		doc.name.last = req.body.lastName;
		doc.city = req.body.city;

		doc.$__save({}, (err, userDoc) => {
			const userToReturn = {
				id: userDoc._id,
				email: userDoc.email,
				pictureUrl: userDoc.pictureUrl,
				username: userDoc.username,
				ratings: userDoc.ratings,
				relations: userDoc.relations,
				messages: userDoc.messages,
				name: userDoc.name,
				city: userDoc.city,
			};

			if (err) {
				return res.status(404).json({
					title: 'Error!',
					error: 'Could not store your changes, try again please.'
				});
			}

			return res.status(200).json({
				message: 'Success',
				obj: userToReturn
			});
		});
	});
});

module.exports = router;