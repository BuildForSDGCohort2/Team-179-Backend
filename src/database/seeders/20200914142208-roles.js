/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Roles',
    [
      {
        role: 'farmer',
        description: 'Farmer has the ability to read, update, delete and write projects',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'admin',
        description: 'Admin role have access to all the endpoints',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'investor',
        description: 'Investor role have the ability to read all the projects and donate',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'client',
        description: 'Client role have the ability to read all the projects',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Roles', null, {}),
};
