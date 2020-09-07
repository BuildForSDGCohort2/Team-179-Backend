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
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    salt: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    emailVerificationCode: {
      type: Sequelize.STRING,
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
    },
    emailVerificationRequestDate: {
      type: Sequelize.DATE,
    },
    passwordResetCode: {
      type: Sequelize.STRING,
    },
    passwordResetRequestDate: {
      type: Sequelize.DATE,
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
