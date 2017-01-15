var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');

//var Message = require('../models/message');
var User = require('../models/user');

router.post('/', function (req, res, next) {

   var user = new User({

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

    user.save(function (err, result) {

        if(err) {
            return res.status(404).json({
                title: 'An error occured',
                error: {message: 'Couldn\'t save that user for some reason.'}
            });
        }

        res.status(200).json({
            message: 'Success',
            obj: result
        });

    });

});

router.post('/signin', function (req, res, next) {

    User.findOne({username: req.body.username}, function (err, doc) {

        if(err) {
            return res.status(404).json({
                title: 'An error occured',
                error: {message: 'Wrong username or password!'}
            });
        }

        if(!doc) {
            return res.status(404).json({
                title: 'No user found.',
                error: {message: 'That user does not exist!'}
            });
        }

        if (!passwordHash.verify(req.body.password, doc.password)) {
            return res.status(404).json({
                title: 'Could not sign you in',
                error: {message: 'Invalid password'}
            });
        }

        //Sending the user object as well to be able to use its ID throughout the app
        var token = jwt.sign({user: doc}, 'secret', {expiresIn: '2 days'});

        res.status(200).json({
            message: 'success',
            token: token,
            user: {
                id: doc._id,
                username: doc.username,
                email: doc.email,
                name: doc.name,
                city: doc.city,
                messages: doc.messages,
                relations: doc.relations,
                ratings: doc.ratings,
                pictureUrl: doc.pictureUrl
            }

        });

    });

});

module.exports = router;