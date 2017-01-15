var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.use('/', function (req, res, next) {

    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Authenticaton failed!',
                error: {message: 'You have to sign in first!'}
            });
        }
        next();
    });

});

router.get('/:username', function (req, res, next) {

        //In optimal case keyword will be an exact username, but mostly keyword will be only a part of a username
   var searchTerm = req.params.username;

        //searching for users that match the keyword. "i" is for case-insensitiveness and selecting only the listed fields
    User.find({username: new RegExp('^' + searchTerm, "i")}, 'username messages name pictureUrl email city')
        .exec(function (err, docs) {

            if(err) {
                return res.status(404).json({
                    title: 'Error!',
                    error: {message: 'An error occured during finding the user.'}
                });
            }

            if(!docs) {
                return res.status(404).json({
                    message: 'Cannot find that user',
                    error: {message: 'Cannot find that user'}
                });
            }



            res.status(200).json({
                message: 'Success',
                obj: docs
            });

        });
});

module.exports = router;