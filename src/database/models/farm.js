module.exports = (sequelize, DataTypes) => {
  const Farm = sequelize.define('Farm', {
    id: DataTypes.UUID,
    farmer: DataTypes.STRING,
    landForm: DataTypes.STRING,
    landTenure: DataTypes.STRING,
    irrigationType: DataTypes.STRING,
    soilType: DataTypes.STRING,
    soilDepth: DataTypes.STRING,
    accessibility: DataTypes.BOOLEAN,
    landSize: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  Farm.associate = (models) => {
    Farm.belongsTo(models.User, {
      foreignKey: 'farmerId',
      as: 'farmer',
    });
    Farm.belongsTo(models.Location, {
      foreignKey: 'locationId',
      as: 'location',
    });
  };
  return Farm;
};
