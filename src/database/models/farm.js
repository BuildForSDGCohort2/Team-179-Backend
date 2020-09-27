/**
 * Farm model file for structuring the user farm data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const Farm = sequelize.define('Farm', {
    images: DataTypes.ARRAY(DataTypes.STRING),
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
      foreignKey: 'userId',
      as: 'User',
    });
    Farm.hasOne(models.Location, {
      foreignKey: 'farmId',
      as: 'location',
    });
  };
  return Farm;
};
