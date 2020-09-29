/**
 * mpesab2c migration file for creating the database.
 */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => queryInterface.createTable('MpesaB2Cs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      projectId: {
        type: Sequelize.UUID,
        references: { model: 'Projects', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      resultDesc: {
        type: Sequelize.STRING,
      },
      OriginatorConversationID: {
        type: Sequelize.STRING,
      },
      ConversationID: {
        type: Sequelize.STRING,
      },
      TransactionID: {
        type: Sequelize.STRING,
      },
      ResultParameters: {
        type: Sequelize.JSON,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('MpesaB2Cs'),
};
