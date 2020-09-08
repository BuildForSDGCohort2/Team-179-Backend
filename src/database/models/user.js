/**
 * User model file for structuring the data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      autoIncrement: false,
    },
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
  // eslint-disable-next-line no-unused-vars
  User.associate = (models) => {
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'userProfile',
      onDelete: 'CASCADE',
    });
  };
  return User;
};
