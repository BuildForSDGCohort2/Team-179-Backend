/**
 * Roles model file for structuring the roles data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    role: DataTypes.STRING,
    description: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      foreignKey: 'roleId',
      through: 'RolesAuth',
      as: 'user',
    });
  };
  return Role;
};
