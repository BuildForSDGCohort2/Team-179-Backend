module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      userId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      farmId: {
        type: Sequelize.UUID,
        references: { model: 'Farms', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      dateStarted: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dateEnded: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      imageUrl: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
      targetCost: {
        type: Sequelize.DECIMAL,
      },
      progress: {
        type: Sequelize.DECIMAL,
      },
      isWithdrawable: {
        type: Sequelize.BOOLEAN,
      },
      totalInvested: {
        type: Sequelize.DECIMAL,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Projects'),
};
