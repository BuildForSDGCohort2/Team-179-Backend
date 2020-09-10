module.exports = (sequelize, DataTypes) => {
  const Profiles = sequelize.define('Profile', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    image: DataTypes.STRING,
    bios: DataTypes.STRING,
    phoneNumber: DataTypes.NUMBER,
    gender: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    idNumber: DataTypes.NUMBER,
    kraPin: DataTypes.STRING,
    role: DataTypes.ARRAY(DataTypes.STRING),
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
