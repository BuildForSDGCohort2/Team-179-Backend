module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Profiles', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
    bios: {
      type: Sequelize.STRING,
    },
    certificateOfConduct: {
      type: Sequelize.STRING,
    },
    phoneNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    idNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    kraPin: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    role: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Profiles'),
};
