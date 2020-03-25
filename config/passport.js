var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt =  require('passport-jwt').ExtractJwt;
const mysql = require('mysql');

 

var config = require('../config/database');

var con = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password
});
 
// get db config file
module.exports = function(passport) {
  con.connect(function(err) {
    if (err) console.log(err);
    console.log("Connected!");
  });
  // var opts = {};
  // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  // opts.secretOrKey = config.secret;
  // passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  //   User.findOne({id: jwt_payload.id}, function(err, user) {
  //         if (err) {
  //             return done(err, false);
  //         }
  //         if (user) {
  //             done(null, user);
  //         } else {
  //             done(null, false);
  //         }
  //     });
  // }));
};