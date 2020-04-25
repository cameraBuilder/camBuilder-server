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

  sequelize.User.getUser({ email:req.body.email }).then(data =>{
    if(data) {
      return res.status(400).json(new response(400, null, "Already registered with this email").JSON)
    }
    sequelize.User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
  }).then(function (user) {
      if (user) {
        return res.status(201).json(new response(201, null, "Registraion Successful").JSON);
      } else {
        return res.status(500).json(new response(500, null, "Internal Server Error").JSON);
      }
  });
  })
});

apiRoutes.post('/login', function(req, res) {
    if (!req.body.password || !req.body.email) {
        return res.status(400).json(new response(400, null, "All fields are required").JSON)
      }
      if(!validator(req.body.email)) {
        return res.status(400).json(new response(400, null, "Invalid Email format").JSON)
      }
    
      sequelize.User.getUser({ email:req.body.email }).then(promiseData =>{
        if(!promiseData) {
          return res.status(401).json(new response(401, null, 'Email not registered').JSON)
        }
        sequelize.User.comparePassword(req.body.password, promiseData.password,function (err, isMatch) {
          console.log("ErrorLog: " + err)
            if (isMatch && !err) {
             var token = jwt.encode(promiseData, sequelize.secret);
             return res.status(200).json(new response(200, {token: 'bearer ' + token, id:promiseData.id, username:promiseData.username, email:promiseData.email}, "Logedd In!").JSON)
            } 
              return res.status(401).json(new response(401, null, 'Authentication failed. Wrong Email or Password.').JSON)
          })
      });
     })


apiRoutes.get('/cameras', function(req, res) {
  sequelize.Camera.getAllCams().then(data => {
    return res.status(200).json(new response(200, data, "All Cams here!").JSON)
  })
})

apiRoutes.get('/camera/:id', function(req, res) {
  sequelize.Camera.getCam({id:req.params.id}).then(data => {
    return res.status(200).json(new response(200, data, "Your Cam is here!").JSON)
  })
})

apiRoutes.get('/lenses', function(req, res) {
  sequelize.Lens.getAllLenses().then(data => {
    return res.status(200).json(new response(200, data, "All Lenses here!").JSON)
  })
})

apiRoutes.get('/lens/:id', function(req, res) {
  sequelize.Lens.getLens({id:req.params.id}).then(data => {
    return res.status(200).json(new response(200, data, "Lens here!").JSON)
  })
})

apiRoutes.get('/flashes', function(req, res) {
  sequelize.Flash.getAllFlashes().then(data => {
    return res.status(200).json(new response(200, data, "All Flashes here!").JSON)
  })
})

apiRoutes.get('/flash/:id', function(req, res) {
  sequelize.Flash.getFlash({id:req.params.id}).then(data => {
    return res.status(200).json(new response(200, data, "All Flashes here!").JSON)
  })
})



apiRoutes.get('/adapters', function(req, res) {
  sequelize.Adapter.getAllAdapters().then(data => {
    return res.status(200).json(new response(200, data, "All Adapters here!").JSON)
  })
})


apiRoutes.get('/adapter/:id', function(req, res) {
  sequelize.Adapter.getAdapter({id:req.params.id}).then(data => {
    return res.status(200).json(new response(200, data, "Adapter here!").JSON)
  })
})


apiRoutes.post('/getUserProfile', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, sequelize.secret);
      sequelize.User.getUser({ email:decoded.email }).then(promiseData =>{
        if (!promiseData) {
          return res.status(401).json(new response(401, null, "Token Expired").JSON)
        } else {
          return res.status(200).json(new response(200, {user:{email:promiseData.email, username:promiseData.username}}, "User found!").JSON)
        }
      })
    }
  });


  apiRoutes.post('/addToBag', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, sequelize.secret);
      sequelize.User.getUser({ email:decoded.email }).then(promiseData =>{
        if (!promiseData) {
          return res.status(401).json(new response(401, null, "Token Expired").JSON)
        } else {
          if (promiseData.bagId && promiseData.bagId != 0) {
            const bag = sequelize.Bag.getBag({id:promiseData.bagId})
            console.log(bag)
          }
          else{
            sequelize.Bag.create({item:""})
            console.log("Bag created")
          }
          return res.status(200).json(new response(200, null, "Item Added").JSON)
        }
      })
    }
  });


apiRoutes.post('/createKit', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, sequelize.secret);
      sequelize.User.getUser({ email:decoded.email }).then(promiseData =>{
        if (!promiseData) {
          return res.status(401).json(new response(401, null, "Token Expired").JSON)
        } else {
          var jsob = JSON.parse(req.body.kit)

          if(jsob.id && jsob.id > 0) {
            sequelize.kit.getKit({id:jsob.id}).then(currentKit =>{
              if (currentKit) {
                currentKit.update({
                  items: jsob.items
                }).then(src =>{
                  return res.status(201).json(new response(200, null, "Updated !").JSON);
                })
              }
              else{
                return res.status(500).json(new response(500, null, "Kit not found !").JSON);
              }
            })
          }
          else {
            sequelize.kit.create(jsob).then(function (kit) {
              if (kit) {
                return res.status(201).json(new response(201, null, "Saved !").JSON);
              } else {
                return res.status(500).json(new response(500, null, "Internal Server Error").JSON);
              }
          }).catch(function(err) {
            console.log('Error inserting user:');
            console.log(err);
          });
          }
        }
      })
    }
  });

  apiRoutes.post('/findUserKits', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, sequelize.secret);
      sequelize.User.getUser({ email:decoded.email }).then(promiseData =>{
        if (!promiseData) {
          return res.status(401).json(new response(401, null, "Token Expired").JSON)
        } else {
          sequelize.kit.getAllMatchedKit({
            userId:req.body.id
          }).then(kits => {
            if(!kits) {
              return res.status(500).json(new response(500, null, "No kits found").JSON)
            }
            else{
              (async () => {
                var allKits = [];
                for(var k = 0;k < kits.length; k++){
                  var kitItems = [];
                  let items = kits[k].items.split(",");
                  for(var i = 0; i < items.length; i++) {
                    let type = items[i].charAt(0);
                    let id = items[i].substring(1, items[i].length)
                    let tag = ""
                    let product = {}
                    switch(type) {
                      case "c":
                        tag = "camera"
                        product =  await sequelize.Camera.getCam({id: id});
                        break;
                        case "f":
                          tag = "flash"
                          product =  await sequelize.Flash.getFlash({id: id});
                          break;
                       case "a":
                        tag = "adapter"
                         product =  await sequelize.Adapter.getAdapter({id: id});
                         break;
  
                      case "l":
                        tag = "lens"
                        product = await sequelize.Lens.getLens({id: id});
                        break;
                    }
                  kitItems.push({tag:tag,product:JSON.stringify(product)})
                  }
                  allKits.push({id:kits[k].id, kitItems:kitItems})
                }
                return res.status(200).json(new response(200, allKits, "Kits found").JSON)
              })()
            }
          })
          }
  })}});

    apiRoutes.post('/findCompatibleAdapters', passport.authenticate('jwt', { session: false}), function(req, res) {
      var token = getToken(req.headers);
      if (token) {
        var decoded = jwt.decode(token, sequelize.secret);
        sequelize.User.getUser({ email:decoded.email }).then(promiseData =>{
          if (!promiseData) {
            return res.status(401).json(new response(401, null, "Token Expired").JSON)
          } else {
            sequelize.Adapter.getAllMatchedAdapter({compatibleCameraMount: req.body.cameraMount, compatibleLenseMount:req.body.lensMount}).then(adapters =>{
              return res.status(200).json(new response(200, adapters, "Matched Adpters").JSON)
            });}
})}});



  
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

  apiRoutes.ip = ""
  module.exports = apiRoutes