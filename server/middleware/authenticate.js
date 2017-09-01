const UserSchema = require('./../models/user');

const authenticate = (req, res, next) => {
  let token = req.header('Authorization');
    
    UserSchema.findByToken(token).then(user => {
      if (!user) {
        return Promise.reject();
      }
      req.user = { id: user._id, email: user.email, pictureUrl: user.pictureUrl, username: user.username, ratings: user.ratings, relations: user.relations, messages: user.messages, name: user.name };
      req.token = token;
      next();
    })
    .catch(error => {
      return res.status(401).json({
        title: 'Unauthorized error!',
        error: { message: 'Authorization error! Try again.' }
      });
    });
}

module.exports = authenticate;