module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    county: DataTypes.STRING,
    longitude: DataTypes.STRING,
    latitude: DataTypes.STRING,
    geoLocation: DataTypes.GEOMETRY('POINT'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  // eslint-disable-next-line no-unused-vars
  Location.associate = (models) => {
    // Location.hasMany(models.Farm, {
    //   foreignKey: 'locationId',
    //   as: 'farms',
    // });
  };
  return Location;
};
