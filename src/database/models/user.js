/**
 * User model file for structuring the data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    bios: DataTypes.STRING,
    phone_number: DataTypes.NUMBER,
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    id_number: DataTypes.NUMBER,
    kra_pin: DataTypes.STRING,
    certificate_of_coduct: DataTypes.STRING,
    token: DataTypes.STRING,
    email_verification_code: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
    email_verification_request_date: DataTypes.DATE,
    password_reset_code: DataTypes.STRING,
    password_reset_request_date: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  // eslint-disable-next-line no-unused-vars
  User.associate = (models) => {
  };
  return User;
};
