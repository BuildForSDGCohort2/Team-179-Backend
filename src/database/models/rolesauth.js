/**
 * Roles auth model file for structuring the User and role relaionship in the database.
 */
module.exports = (sequelize, DataTypes) => {
  const RolesAuth = sequelize.define('RolesAuth', {
    userId: DataTypes.UUID,
    roleId: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  RolesAuth.associate = (models) => {
    RolesAuth.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    RolesAuth.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });
  };
  return RolesAuth;
};
