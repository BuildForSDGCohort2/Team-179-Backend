/**
 * Profile model file for structuring the additional user data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    image: DataTypes.STRING,
    bios: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    idNumber: DataTypes.STRING,
    kraPin: DataTypes.STRING,
    certificateOfConduct: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  // eslint-disable-next-line no-unused-vars
  Profile.associate = (models) => {
    Profile.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };
  return Profile;
};
