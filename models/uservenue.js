'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserVenue = sequelize.define('UserVenue', {
    UserId: DataTypes.INTEGER,
    VenueId: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  })
  UserVenue.associate = (models) => {
    UserVenue.belongsTo(models.User)
    UserVenue.belongsTo(models.Venue)
  };
  return UserVenue;
};