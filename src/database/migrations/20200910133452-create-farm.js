module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => queryInterface.createTable('Farms', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      farmerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      locationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Locations', key: 'id' },
        onDelete: 'CASCADE',
      },
      landForm: {
        type: Sequelize.STRING,
      },
      landTenure: {
        type: Sequelize.STRING,
      },
      irrigationType: {
        type: Sequelize.STRING,
      },
      soilType: {
        type: Sequelize.STRING,
      },
      soilDepth: {
        type: Sequelize.STRING,
      },
      accessibility: {
        type: Sequelize.BOOLEAN,
      },
      landSize: {
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
    })),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Farms'),
};
