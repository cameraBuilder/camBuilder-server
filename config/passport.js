var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt =  require('passport-jwt').ExtractJwt;
var sequelize = require('../config/database');
var User = sequelize.User;
 
module.exports = function(passport) {
  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = "thecode007";
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
      let user = User.getUser({ id: jwt_payload.id });
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    }));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};