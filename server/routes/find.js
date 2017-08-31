const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.get('/:username', (req, res, next) => {

	//In optimal case keyword will be an exact username, but mostly keyword will be only a part of a username
	const searchTerm = req.params.username;

	//searching for users that match the keyword. "i" is for case-insensitiveness and selecting only the listed fields
	User.find({ username: new RegExp('^' + searchTerm, "i") }, 'username messages name pictureUrl email city')
		.exec((err, docs) => {

			if (err) {
				return res.status(404).json({
					title: 'Error!',
					error: { message: 'An error occured during finding the user.' }
				});
			}

			if (!docs) {
				return res.status(404).json({
					message: 'Cannot find that user',
					error: { message: 'Cannot find that user' }
				});
			}

			res.status(200).json({
				message: 'Success',
				obj: docs
			});

		});
});

module.exports = router;