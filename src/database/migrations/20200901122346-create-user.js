/**
 * User migration file for creating the database.
 */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
    },
    certificate_of_coduct: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    kra_pin: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.STRING,
    },
    date_of_birth: {
      type: Sequelize.DATE,
    },
    email_verification_code: {
      type: Sequelize.STRING,
    },
    email_verified: {
      type: Sequelize.BOOLEAN,
    },
    email_verification_request_date: {
      type: Sequelize.DATE,
    },
    password_reset_code: {
      type: Sequelize.STRING,
    },
    password_reset_request_date: {
      type: Sequelize.DATE,
    },
    bios: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
