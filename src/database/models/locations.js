module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    county: DataTypes.STRING,
    longitude: DataTypes.STRING,
    latitude: DataTypes.STRING,
    geom: DataTypes.GEOMETRY('POINT'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  Location.associate = (models) => {
    Location.hasMany(models.Farm, {
      foreignKey: 'locationId',
      as: 'farms',
    });
  };
  return Location;
};
