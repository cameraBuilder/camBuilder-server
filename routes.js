var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var mongoose    = require('mongoose');
var response    = require('./app/models/response');
var jwt         = require('jwt-simple');
var validator   = require('./validators');
var passport	= require('passport');
var express     = require('express');


// connect to database
mongoose.connect(config.database, { useNewUrlParser: true });
 
// pass passport for configuration
require('./config/passport')(passport);
 
// bundle our routes
var apiRoutes = express.Router();
 


apiRoutes.post('/Register', function(req, res) {
   
    // checks if at least one field is empty
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res.status(400).json(new response(400, null, "All fields are required").JSON)
  }

  // checks email format validity
  if(!validator(req.body.email)) {
    return res.status(400).json(new response(400, null, "Invalid Email format").JSON)
  }

  var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      type: 1
    });

    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.status(400).json(new response(400, null, "Email already exists").JSON);
      }
      return res.status(201).json(new response(201, null, "Registraion Successful").JSON);
    });
});


apiRoutes.post('/login', function(req, res) {
    if (!req.body.password || !req.body.email) {
        return res.status(400).json(new response(400, null, "All fields are required").JSON)
      }
      if(!validator(req.body.email)) {
        return res.status(400).json(new response(400, null, "Invalid Email format").JSON)
      }
    
    User.findOne({
      email: req.body.email
    }, function(err, user) {

      if (err) throw err;

      // if user not found
      if (!user) {
        return res.status(401).json(new response(401, null, 'Authentication failed. Wrong Username or Password.').JSON)
    } 
    else
     {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.encode(user, config.secret);
           return res.status(200).json(new response(200, {token: 'bearer ' + token, username:user.username, email:user.email, areeba_token:user.areeba_token}, "Logedd In!").JSON)
          } 
            return res.status(401).json(new response(401, null, 'Authentication failed. Wrong Username or Password.').JSON)
        })}
})})

apiRoutes.post('/getUserProfile', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, config.secret);
      User.findOne({
        name: decoded.name
      }, function(err, user) {
          if (err) throw err;
   
          if (!user) {
            return res.status(401).json(new response(401, null, "Authentication failed, user not found").JSON)
          } else {
            return res.status(200).json(new response(200, {user:{email:user.email, username:user.username}}, "User found!").JSON)
          }
      });
    } else {
      return res.status(403).json(new response(403, null, "Authentication failed, no access token").JSON)
    }
  });
   


  // split header to retrive the token
  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  module.exports = apiRoutes