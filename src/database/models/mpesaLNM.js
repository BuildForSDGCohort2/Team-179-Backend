/**
 * Lipa na Mpesa model file for structuring the business mpesa transaction data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const MpesaLNP = sequelize.define('MpesaLNM', {
    MerchantRequestID: DataTypes.STRING,
    CheckoutRequestID: DataTypes.STRING,
    MpesaReceiptNumber: DataTypes.STRING,
    TransactionAmount: DataTypes.DOUBLE,
    Balance: DataTypes.DOUBLE,
    TransactionDate: DataTypes.STRING,
    PhoneNumber: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  // eslint-disable-next-line no-unused-vars
  MpesaLNP.associate = (models) => {
    MpesaLNP.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    MpesaLNP.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });
  };
  return MpesaLNP;
};
