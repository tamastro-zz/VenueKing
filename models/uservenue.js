'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserVenue = sequelize.define('UserVenue', {
    UserId: DataTypes.INTEGER,
    VenueId: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    date: DataTypes.STRING,
    unique: DataTypes.INTEGER
  })
  UserVenue.associate = (models) => {
    UserVenue.belongsTo(models.User)
    UserVenue.belongsTo(models.Venue)
  };
  return UserVenue;
};