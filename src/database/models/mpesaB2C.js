/**
 * B2C model file for structuring the business B2C mpesa transaction data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const MpesaB2C = sequelize.define('MpesaB2C', {
    resultDesc: DataTypes.STRING,
    OriginatorConversationID: DataTypes.STRING,
    ConversationID: DataTypes.STRING,
    TransactionID: DataTypes.STRING,
    ResultParameters: DataTypes.JSON,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  // eslint-disable-next-line no-unused-vars
  MpesaB2C.associate = (models) => {
    MpesaB2C.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
    });
    MpesaB2C.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'Project',
    });
  };
  return MpesaB2C;
};
