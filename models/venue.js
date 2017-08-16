'use strict';
module.exports = function(sequelize, DataTypes) {
  var Venue = sequelize.define('Venue', {
    name: DataTypes.STRING,
    quota: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    price: DataTypes.INTEGER,
    address: DataTypes.STRING
  })
  Venue.associate = (models) => {
    Venue.belongsToMany(models.User, {
      through: `UserVenue`,
      foreignKey: `VenueId`
    })
  };
  return Venue;
};