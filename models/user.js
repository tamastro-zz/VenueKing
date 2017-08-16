'use strict';

const random = require('../views/helper/randomizer')

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Username Already Exist'
      }
    },
    fullname: DataTypes.STRING,
    role: DataTypes.STRING,
    rank: DataTypes.INTEGER,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid Email Format'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function (models) {
        let salt = random.randomStr(8);
        let password = models.password
        models.password = random.hashish(salt, password);
        models.salt = salt;
      }
    }
  })
  User.associate = (models) => {
    User.belongsToMany(models.Venue, {
      through: `UserVenue`,
      foreignKey: `UserId`
    })
  };
  return User;
};