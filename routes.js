var sequelize      = require('./config/database'); // get db config file
var response    = require('./app/models/response');
var jwt         = require('jwt-simple');
var validator   = require('./validators');
var passport	= require('passport');
var express     = require('express');


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

  sequelize.User.create({
    username: req.body.name,
    email: req.body.email,
    password: req.body.password
}).then(function (user) {
    if (user) {
      return res.status(201).json(new response(201, null, "Registraion Successful").JSON);
    } else {
      return res.status(400).json(new response(400, null, "Email already exists").JSON);
    }
});
});

apiRoutes.post('/login', function(req, res) {
    if (!req.body.password || !req.body.email) {
        return res.status(400).json(new response(400, null, "All fields are required").JSON)
      }
      if(!validator(req.body.email)) {
        return res.status(400).json(new response(400, null, "Invalid Email format").JSON)
      }
    
      let user =  sequelize.User.getUser({ email });
      if(!user) {
        return res.status(401).json(new response(401, null, 'Authentication failed. Wrong Email or Password.').JSON)
      }
      sequelize.User.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
           var token = jwt.encode(user, config.secret);
           return res.status(200).json(new response(200, {token: 'bearer ' + token, username:user.username, email:user.email}, "Logedd In!").JSON)
          } 
            return res.status(401).json(new response(401, null, 'Authentication failed. Wrong Email or Password.').JSON)
        })
})

apiRoutes.post('/getUserProfile', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, config.secret);
      let user = sequelize.User.getUser({ email:decoded.email })
      if (!user) {
            return res.status(401).json(new response(401, null, "Token Expired").JSON)
          } else {
            return res.status(200).json(new response(200, {user:{email:user.email, username:user.username}}, "User found!").JSON)
          }
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

  