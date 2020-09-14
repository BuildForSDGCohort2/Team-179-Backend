/**
 * Profile model file for structuring the additional user data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const Profiles = sequelize.define('Profile', {
    images: DataTypes.ARRAY(DataTypes.STRING),
    bios: DataTypes.STRING,
    phoneNumber: DataTypes.NUMBER,
    userId: DataTypes.UUID,
    gender: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    idNumber: DataTypes.NUMBER,
    kraPin: DataTypes.STRING,
    certificateOfConduct: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  // eslint-disable-next-line no-unused-vars
  Profiles.associate = (models) => {
    // Profile.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };
  return Profiles;
};
