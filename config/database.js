const Sequelize = require("sequelize");
var bcrypt = require('bcrypt');

const sequelize = new Sequelize('FM8OApCbgk', 'FM8OApCbgk', 'IDA1qIvHMR', {
  host: 'remotemysql.com',
  dialect:  'mysql',
  
}, {
  define: {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  }
}
)


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
  },{ timestamps: false });

  User.removeAttribute('id')

  User.beforeCreate( (user, options) => {
    return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => { 
            throw new Error(); 
        });
  });

  // create some helper functions to work on the database
  User.getAllUsers = async () => {
    return  await User.findAll();
  };

  User.getUser =  async obj => {
    return  User.findOne({
    where: obj
  });
  };
 
  User.comparePassword = function (passw, hash,cb) {
    bcrypt.compare(passw, hash, function (err, isMatch) {
        if (err) {
          console.log("compare password");
            return cb(err);
        }
        cb(null, isMatch);
    });
};
 
sequelize.User = User
sequelize.secret = "thecode007"
module.exports = sequelize