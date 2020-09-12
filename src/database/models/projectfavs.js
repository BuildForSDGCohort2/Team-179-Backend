/**
 * Project Favorite model file for structuring the Favorited
 * Projects by user data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const ProjectFavs = sequelize.define('ProjectFavs', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projectId: DataTypes.UUID,
    userId: DataTypes.UUID,
    favourite: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  ProjectFavs.associate = (models) => {
    ProjectFavs.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    ProjectFavs.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });
  };
  return ProjectFavs;
};
