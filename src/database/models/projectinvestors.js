module.exports = (sequelize, DataTypes) => {
  const ProjectInvestors = sequelize.define('ProjectInvestments', {
    id: DataTypes.UUID,
    projectId: DataTypes.UUID,
    userId: DataTypes.UUID,
    amountInvested: DataTypes.DECIMAL,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  ProjectInvestors.associate = (models) => {
    ProjectInvestors.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });
    ProjectInvestors.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return ProjectInvestors;
};
