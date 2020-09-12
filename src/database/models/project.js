/**
 * Project model file for structuring the
 * Projects data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    farmerId: DataTypes.UUID,
    cost: DataTypes.DECIMAL,
    dateStarted: DataTypes.DATE,
    dateEnded: DataTypes.DATE,
    imageUrl: DataTypes.STRING,
    totalInvested: DataTypes.DECIMAL,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  Project.associate = (models) => {
    Project.hasMany(models.ProjectInvestments, {
      foreignKey: 'investorsId',
      as: 'investors',
    });
    Project.belongsTo(models.User, {
      foreignKey: 'farmerId',
      as: 'farmer',
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
