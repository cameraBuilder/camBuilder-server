const Sequelize = require("sequelize");
var bcrypt = require("bcrypt");

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
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
},
    email: {
      type: Sequelize.STRING(100),
      unique: true 
    },
    password: {
      type: Sequelize.STRING,
    },
    username: {
        type: Sequelize.STRING(100),
      }
  },{ timestamps: false });

  

  var Mount = sequelize.define("mount", {
    name: {
      type: Sequelize.STRING(60),
      primaryKey: true
    }
    
  },{ timestamps: false });



  var Camera = sequelize.define("camera", {
    name: {
      type: Sequelize.STRING(60),
      unique: true 
    },
    brand:{
      type: Sequelize.STRING(60)
    },
    type:{
      type: Sequelize.STRING(60)
    },
    description:{
      type: Sequelize.STRING
    },
    images:{
      type: Sequelize.STRING
    },
    mountType: {
      type: Sequelize.STRING(60)
    }
  },{ timestamps: false });

  
  Camera.belongsTo(Mount,  {foreignKey: 'mountType'});


  var Lense = sequelize.define("lense", {
    name: {
      type: Sequelize.STRING(60),
      unique: true 
    },
    brand:{
      type: Sequelize.STRING(60)
    },
    description:{
      type: Sequelize.STRING
    },
    images:{
      type: Sequelize.STRING
    },
    compatibleMount: {
      type: Sequelize.STRING(60)
    }
  },{ timestamps: false });

  Lense.belongsTo(Mount,  {foreignKey: 'compatibleMount'});

  var Flash = sequelize.define("flash", {
    name: {
      type: Sequelize.STRING(60),
      unique: true 
    },
    brand:{
      type: Sequelize.STRING(60)
    },
    description:{
      type: Sequelize.STRING
    },
    images:{
      type: Sequelize.STRING
    }
  },{ timestamps: false });

  var Adapter = sequelize.define("adapter", {
    name: {
      type: Sequelize.STRING(60),
      unique: true 
    },
    brand:{
      type: Sequelize.STRING(60)
    },
    description:{
      type: Sequelize.STRING
    },
    images:{
      type: Sequelize.STRING
    },
    compatibleCameraMount: {
      type: Sequelize.STRING(60)
    },
    compatibleLenseMount: {
      type: Sequelize.STRING(60)
    }
  },{ timestamps: false });

  Adapter.belongsTo(Mount,  {foreignKey: 'compatibleCameraMount'});
  Adapter.belongsTo(Mount,  {foreignKey: 'compatibleLenseMount'});


  var Bag = sequelize.define("bag", {
    items: {
      type: Sequelize.STRING
    }
  },{ timestamps: false });


  var kit = sequelize.define("kit", {
    items: {
      type: Sequelize.STRING
    },
    isOver:{
      type: Sequelize.BOOLEAN
    }
    
  },{ timestamps: false });

  User.belongsTo(Bag);
  kit.belongsTo(User)

  User.beforeCreate((user, options) => {
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

  Camera.getAllCams = async () => {
    return  await Camera.findAll();
  };

  Camera.getCam = async obj => {
    return  await Camera.findOne({
      where: obj
    });
  };
  
  Lense.getAllLenses = async () => {
    return  await Lense.findAll();
  };

  Lense.getLens = async obj => {
    return  await Lense.findOne({
      where: obj
    });
  };

  Adapter.getAllAdapters = async () => {
    return  await Adapter.findAll();
  };

  Adapter.getAdapter = async obj => {
    return  Adapter.findOne({
      where: obj
    });
  };

  User.getUser =  async obj => {
    return  User.findOne({
    where: obj
  });
  };

  Flash.getAllFlashes = async () => {
    return await Flash.findAll();
  };

  Flash.getFlash = async obj => {
    return  await Flash.findOne({
      where: obj
    });
  };

  Bag.getBag = async obj => {
    return  await Bag.findOne({
      where: obj
    });
  };
 
  User.comparePassword = function (passw, hash,cb) {
    bcrypt.compare(passw, hash, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

sequelize.Mount = Mount
sequelize.Camera = Camera
sequelize.User = User
sequelize.Lens = Lense
sequelize.Bag = Bag
sequelize.kit = kit
sequelize.Flash = Flash
sequelize.Adapter = Adapter
sequelize.secret = "thecode007"
module.exports = sequelize