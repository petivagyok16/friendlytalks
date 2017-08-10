const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.use('/', (req, res, next) => {

	jwt.verify(req.query.token, 'secret', (err, decoded) => {
		if (err) {
			return res.status(401).json({
				title: 'Authenticaton failed!',
				error: { message: 'You have to be signed in first!' }
			});
		}
		next();
	});

});

router.get('/:userId', (req, res, next) => {

	const userId = req.params.userId;

	User.findById(userId, 'username messages name pictureUrl email city relations ratings')
		.exec((err, doc) => {

			if (err) {
				return res.status(404).json({
					title: 'An error occured',
					error: { message: 'Talk to the admin for more information please.' }
				});
			}

			if (!doc) {
				return res.status(404).json({
					title: 'Cannot find that user',
					error: { message: 'Cannot find that user' }
				});
			}

			res.status(200).json({
				message: 'Success',
				obj: doc
			});
		});
});

router.patch('/:id', (req, res, next) => {
	//var decoded = jwt.decode(req.query.token);
	console.log('follower user:' + req.params.id);

	console.log('followed user:' + req.body.toFollowId);
	//Finding the followed User to update its follower field
	//first element of the array is the follower user, second is the followed user
	//mongoose gives back in the same order hopefully. BELIEVE
	User.find({ _id: { $in: [req.params.id, req.body.toFollowId] } }, (err, docs) => {

		if (err) {

			return res.status(404).json({
				title: 'An error occurred',
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

		followerUser.save((followerUserErr, followerUserResult) => {

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

	User.findById(userId)
		.populate('relations.followers', 'username email name pictureUrl')
		.exec((err, doc) => {
			//console.log(doc);
			if (err) {
				return res.status(404).json({
					title: 'An error occured!',
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

	var userId = req.params.userId;

	User.findById(userId)
		.populate('relations.following', 'username email name pictureUrl')
		.exec((err, doc) => {
			if (err) {
				return res.status(404).json({
					title: 'An error occured',
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

	User.findById(req.params.userId, 'relations.following')
		.populate({
			path: 'relations.following',
			populate: { path: 'messages' }
		})
		.exec((err, doc) => {

			if (err) {
				return res.status(404).json({
					title: 'Error!',
					error: 'Talk to the admin for more information please!'
				});
			}

			res.status(200).json({
				message: 'Success',
				obj: doc.relations.following
			});
		});
});

router.patch('/editprofile/:id', (req, res, next) => {
	var decoded = jwt.decode(req.query.token);

	User.findById(req.params.id, (err, doc) => {

		if (err) {
			return res.status(404).json({
				title: 'An error occurred',
				error: { message: 'Talk to the admin for more information please!' }
			});
		}

		if (!doc) {
			return res.status(404).json({
				title: 'Cannot find that user',
				error: { message: 'Cannot find that user!' }
			});
		}

		if (doc._id != decoded.user._id) {
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

		doc.save((err, result) => {

			if (err) {
				return res.status(404).json({
					title: 'Error!',
					error: 'Could not store your changes, try again please.'
				});
			}

			return res.status(200).json({
				message: 'Success',
				obj: result
			});
		});
	});
});

module.exports = router;