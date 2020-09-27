/**
 * Project Investmet model file for structuring the prject invested data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const ProjectInvestors = sequelize.define('ProjectInvestments', {
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
