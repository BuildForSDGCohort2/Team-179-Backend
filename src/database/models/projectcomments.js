/**
 * Project Comments model file for structuring the comments
 * of a projects by user data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const ProjectComments = sequelize.define('ProjectComments', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projectId: DataTypes.UUID,
    userId: DataTypes.UUID,
    body: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  ProjectComments.associate = (models) => {
    ProjectComments.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    ProjectComments.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });
  };
  return ProjectComments;
};
