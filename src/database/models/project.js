/**
 * Project model file for structuring the
 * Projects data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    dateStarted: DataTypes.DATE,
    dateEnded: DataTypes.DATE,
    imageUrl: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    targetCost: DataTypes.DOUBLE,
    progress: DataTypes.DOUBLE,
    totalInvested: DataTypes.DOUBLE,
    isWithdrawable: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  Project.associate = (models) => {
    Project.hasMany(models.ProjectInvestments, {
      foreignKey: 'projectId',
      as: 'investors',
    });
    Project.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
    });
    Project.belongsTo(models.Farm, {
      foreignKey: 'farmId',
      as: 'farm',
    });
    Project.hasMany(models.ProjectComments, {
      foreignKey: 'projectId',
      as: 'comments',
    });
    Project.hasMany(models.ProjectFavs, {
      foreignKey: 'projectId',
      as: 'favourites',
    });
  };
  return Project;
};
