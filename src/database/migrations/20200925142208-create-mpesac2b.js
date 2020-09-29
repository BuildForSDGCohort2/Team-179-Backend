/**
 * mpesab2c migration file for creating the database.
 */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => queryInterface.createTable('MpesaC2Bs', {
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
      TransactionType: {
        type: Sequelize.STRING,
      },
      TransID: {
        type: Sequelize.STRING,
      },
      TransTime: {
        type: Sequelize.STRING,
      },
      TransAmount: {
        type: Sequelize.DOUBLE,
      },
      BusinessShortCode: {
        type: Sequelize.STRING,
      },
      BillRefNumber: {
        type: Sequelize.STRING,
      },
      InvoiceNumber: {
        type: Sequelize.STRING,
      },
      ThirdPartyTransID: {
        type: Sequelize.STRING,
      },
      MSISDN: {
        type: Sequelize.STRING,
      },
      FirstName: {
        type: Sequelize.STRING,
      },
      MiddleName: {
        type: Sequelize.STRING,
      },
      LastName: {
        type: Sequelize.STRING,
      },
      OrgAccountBalance: {
        type: Sequelize.DOUBLE,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('MpesaC2Bs'),
};
