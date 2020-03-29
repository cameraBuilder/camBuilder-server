const Sequelize = require("sequelize");
var bcrypt = require('bcrypt');

const sequelize = new Sequelize('FM8OApCbgk', 'FM8OApCbgk', 'IDA1qIvHMR', {
  host: 'remotemysql.com',
  dialect:  'mysql'
})


var User = sequelize.define("user", {
    email: {
      type: Sequelize.STRING,
      unique: true 
    },
    password: {
      type: Sequelize.STRING,
    },
    username: {
        type: Sequelize.STRING,
      }
  });

  User.beforeCreate(async (user, options) => {

    var user = this;
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
          console.log(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) {
            console.log(err);
          }
          user.password = hash;
      });
        
    });
  });

  // create some helper functions to work on the database
  User.getAllUsers =  () => {
    return  User.findAll();
  };

  User.getUser =  obj => {
    return  User.findOne({
    where: obj
  });
  };
 
  User.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
 
sequelize.User = User
module.exports = sequelize