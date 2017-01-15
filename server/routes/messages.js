var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Message = require('../models/message');
var User = require('../models/user');

router.use('/', function (req, res, next) {

    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Authenticaton failed!',
                error: {message: 'You have to be signed in first!'}
            });
        }
        next();
    });

});

router.get('/:skipper', function (req, res, next) {
    
    Message.find().sort({ _id: -1 }).skip(parseInt(req.params.skipper)).limit(10)
        .populate('user', 'username pictureUrl')
        .exec(function (err, docs) {

            if(err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: {message: 'An error occured. Talk to the admin for more information please.'}
                });
            }

            /* if (docs.length === 0) {
                return res.status(404).json({
                    title: 'No more message',
                    error: {message: 'All the messages have been loaded'}
                });
            } */
            
            return res.status(200).json({
                message: 'Success',
                obj: docs
            });

        });
});

router.post('/', function (req, res, next) {

    var decoded = jwt.decode(req.query.token);

    //Decoded token contains the user object as well, so we can use it here
    //to match the userId with the message
    User.findById(decoded.user._id, function (err, UserDoc) {
        if (err) {
            return res.status(404).json({
                title: 'Error!',
                error: {message: 'An error occured during the creation of a message.'}
            });
        }

        var message = new Message({

            content: req.body.content,
            created_at: req.body.created_at,
            user: UserDoc //Mongoose is clever enough to choose the ID from the complete user (doc) object
                    //because the user field has been set as a Reference to the User model.

        });

        message.save(function (err, result) {

            if(err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: {message: 'Message cannot be stored. Try again please.'}
                });
            }

            UserDoc.messages.push(result); //same thing happens here as before: User object has the field called messages
                                        //which has been set as a Reference to the Message model
            UserDoc.save();

            res.status(201).json({
                message: 'Saved message',
                obj: {
                    id: result._id,
                    userId: result.user._id,
                    username: result.user.username,
                    pictureUrl: result.user.pictureUrl,
                    meta: {
                        likes: result.meta.likes,
                        dislikes: result.meta.dislikes
                    }
                }
            });

        });

    });

});

router.delete('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);

    Message.findById(req.params.id, function (err, doc) {

        if(err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: {message: 'An error occured when trying to delete the message.'}
            });
        }

        if(!doc) {
            return res.status(404).json({
                title: 'Message cannot be found!',
                error: {message: 'Message Cannot be found!'}
            });
        }

        if (doc.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not authorized!',
                error: {message: 'Message created by other user!'}
            });
        }

        doc.remove(function (err, result) {

            if(err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: {message: 'Message cannot be deleted. Try again please.'}
                });
            }

            return res.status(200).json({
                message: 'Success',
                obj: result
            });

        });

    });

});

router.patch('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);

    Message.findById(req.params.id, function (err, doc) {

        if(err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: {message: 'An error occured during finding the message in the database.'}
            });
        }

        if(!doc) {
            return res.status(404).json({
                title: 'Error!',
                error: {message: 'Message cannot be found!'}
            });
        }

        if (doc.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not authorized!',
                error: {message: 'Message created by other user!'}
            });
        }

        doc.content = req.body.content;

        doc.save(function (err, result) {

            if(err) {
                return res.status(404).json({
                    title: 'An error occured',
                    error: {message: 'Changes cannot be stored.'}
                });
            }

            return res.status(200).json({
                message: 'Success',
                obj: result
            });

        });

    });

});

router.patch('/rate/:id', function (req, res, next) {

    var rating = req.body.rating;
    var raterUserId = req.body.raterUserId;
    var prevRating = req.body.prevRating;
    var messageId = req.params.id;

    Message.findById(messageId)
        .populate('user meta.likes meta.dislikes', 'ratings')
        .exec(function (err, message) {

            if(err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: {message: 'An error occured during rating the message.'}
                });
            }

            if(!message) {
                return res.status(404).json({
                    title: 'Error!',
                    error: {message: 'Message Cannot be found!'}
                });
            }

            User.findById(raterUserId, function (err, raterUser) {

                if (err) {
                    console.log('Cannot find raterUser', + err);
                }

                var messageOwner = message.user;

                //LIKE
                var likeRater = messageOwner.ratings.my.likes.indexOf(raterUserId);
                
                var likeOfMessage = message.meta.likes.indexOf(raterUserId);
                
                var messageLikedByRaterUser = raterUser.ratings.given.likes.indexOf(messageId);
                

                //DISLIKE
                var dislikeRater = messageOwner.ratings.my.dislikes.indexOf(raterUserId);
                
                var dislikeOfMessage = message.meta.dislikes.indexOf(raterUserId);
                
                var messageDislikedByRaterUser = raterUser.ratings.given.dislikes.indexOf(messageId);
                

                var Rating = {
                    NO_RATING: 0,
                    LIKE: 1,
                    DISLIKE: 2
                };

                switch (rating) {
                    case Rating.NO_RATING:

                        if (prevRating === Rating.LIKE) {

                            messageOwner.ratings.my.likes.splice(likeRater, 1);

                            message.meta.likes.splice(likeOfMessage, 1);

                            raterUser.ratings.given.likes.splice(messageLikedByRaterUser, 1);

                            raterUser.save(function (err) {
                                if (err) console.log('raterUser saving error: ' + err);
                            });
                            break;
                        }

                        if (prevRating === Rating.DISLIKE) {

                            messageOwner.ratings.my.dislikes.splice(dislikeRater, 1);

                            message.meta.dislikes.splice(dislikeOfMessage, 1);

                            raterUser.ratings.given.dislikes.splice(messageDislikedByRaterUser, 1);

                            raterUser.save(function (err) {
                                if (err) console.log('raterUser saving error: ' + err);
                            });

                            break;
                        }

                    case Rating.LIKE:
                        //ID must be stored in 3 different places: message, messageOwner, raterUser
                        if (prevRating === Rating.NO_RATING) {

                            messageOwner.ratings.my.likes.push(raterUserId);

                            message.meta.likes.push(raterUserId);

                            raterUser.ratings.given.likes.push(messageId);

                            raterUser.save(function (err) {
                                if (err) console.log('raterUser saving error: ' + err);
                            });

                            break;
                        }

                        if (prevRating === Rating.DISLIKE) {

                            //removing previous ratings
                            messageOwner.ratings.my.dislikes.splice(dislikeRater, 1);

                            message.meta.dislikes.splice(dislikeOfMessage, 1);

                            raterUser.ratings.given.dislikes.splice(messageDislikedByRaterUser, 1);

                            //adding new ratings
                            messageOwner.ratings.my.likes.push(raterUserId);

                            message.meta.likes.push(raterUserId);

                            raterUser.ratings.given.likes.push(messageId);

                            raterUser.save(function (err) {
                               if (err) console.log('raterUser saving error: ' + err);
                            });

                            break;
                        }


                    case Rating.DISLIKE:

                        if (prevRating === Rating.NO_RATING) {

                            messageOwner.ratings.my.dislikes.push(raterUserId);

                            message.meta.dislikes.push(raterUserId);

                            raterUser.ratings.given.dislikes.push(messageId);

                            raterUser.save(function (err) {
                                if (err) console.log('raterUser saving error: ' + err);
                            });
                            break;
                        }

                        if (prevRating === Rating.LIKE) {

                            //removing previous ratings
                            messageOwner.ratings.my.likes.splice(likeRater, 1);

                            message.meta.likes.splice(likeOfMessage, 1);

                            raterUser.ratings.given.likes.splice(messageLikedByRaterUser, 1);

                            //adding the ratings
                            messageOwner.ratings.my.dislikes.push(raterUserId);

                            message.meta.dislikes.push(raterUserId);

                            raterUser.ratings.given.dislikes.push(messageId);

                            raterUser.save(function (err) {
                                if (err) console.log('raterUser saving err: ' + err);
                            });
                            break;
                        }
                }

                messageOwner.save(function (err) {
                    if (err) console.log('messageOwner saving err: ' + err);
                });

                message.save(function (err, result) {

                    if(err) {
                        console.log(err);
                    /*    return res.status(404).json({
                            message: 'An error occured',
                            error: err
                        }); */
                    }

                    return res.status(200).json({
                        message: 'Success',
                        obj: result
                    });
                });
            });
        });
});

module.exports = router;