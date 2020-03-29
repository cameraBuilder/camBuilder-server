// var bcrypt = require('bcrypt');
// const Sequelize = require('sequelize');

// var User = Sequelize.define("user", {
//     email: {
//       type: Sequelize.STRING,
//       unique: true 
//     },
//     password: {
//       type: Sequelize.STRING,
//     },
//     username: {
//         type: Sequelize.STRING,
//       },
//   });

//   User.beforeCreate(async (user, options) => {
//     var user = this;
//     return bcrypt.hash(user.password, 10)
//         .then(hash => {
//             user.password = hash;
//         })
//         .catch(err => { 
//             throw new Error(); 
//         });
// });

//   // create some helper functions to work on the database
//   User.getAllUsers = async () => {
//     return await User.findAll();
//   };
//   User.getUser = async obj => {
//     return await User.findOne({
//     where: obj,
//   });
//   };
 
//   User.comparePassword = function (passw, cb) {
//     bcrypt.compare(passw, this.password, function (err, isMatch) {
//         if (err) {
//             return cb(err);
//         }
//         cb(null, isMatch);
//     });
// };
 
// module.exports = User;