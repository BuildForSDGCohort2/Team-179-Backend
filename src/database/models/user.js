/**
 * User model file for structuring the data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: DataTypes.UUID,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    salt: DataTypes.TEXT,
    emailVerificationCode: DataTypes.STRING,
    emailVerified: DataTypes.BOOLEAN,
    emailVerificationRequestDate: DataTypes.DATE,
    passwordResetCode: DataTypes.STRING,
    passwordResetRequestDate: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  User.associate = (models) => {
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'userProfile',
      onDelete: 'CASCADE',
    });
    User.belongsToMany(models.Roles, {
      foreignKey: 'userId',
      through: 'RolesAuth',
      as: 'roles',
    });
    User.hasMany(models.Farm, {
      foreignKey: 'userId',
      as: 'farms',
    });
    User.hasMany(models.ProjectInvestments, {
      foreignKey: 'userId',
      as: 'invested',
    });
    User.hasMany(models.Project, {
      foreignKey: 'userId',
      as: 'projects',
    });
    User.hasMany(models.ProjectFavs, {
      foreignKey: 'userId',
      as: 'favourites',
    });
    User.hasMany(models.ProjectComments, {
      foreignKey: 'userId',
      as: 'comments',
    });
  };
  return User;
};
