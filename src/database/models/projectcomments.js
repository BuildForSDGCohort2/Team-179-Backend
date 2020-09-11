module.exports = (sequelize, DataTypes) => {
  const ProjectComments = sequelize.define('ProjectComments', {
    id: DataTypes.UUID,
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
