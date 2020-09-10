module.exports = (sequelize, DataTypes) => {
  const RolesAuth = sequelize.define('RolesAuth', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
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
