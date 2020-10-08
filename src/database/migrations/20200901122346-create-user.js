/**
 * User migration file for creating the database.
 */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
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
      },
      roles: { type: Sequelize.ARRAY(Sequelize.STRING) },
      accessToken: { type: Sequelize.ARRAY(Sequelize.STRING) },
      password: {
        type: Sequelize.TEXT,
      },
      displayName: {
        type: Sequelize.STRING,
      },
      providerId: {
        type: Sequelize.TEXT,
      },
      provider: {
        type: Sequelize.STRING,
      },
      salt: {
        type: Sequelize.TEXT,
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
    })),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
