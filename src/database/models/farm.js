module.exports = (sequelize, DataTypes) => {
  const Farm = sequelize.define('Farm', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    farmer: DataTypes.STRING,
    location: DataTypes.STRING,
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
      as: 'user',
    });
    Farm.belongsTo(models.Location, {
      foreignKey: 'locationId',
      as: 'location',
    });
  };
  return Farm;
};
