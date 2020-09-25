/**
 * C2B model file for structuring the business Mpesa C2B transactions  data in to the database.
 */
module.exports = (sequelize, DataTypes) => {
  const MpesaC2B = sequelize.define('MpesaC2B', {
    TransactionType: DataTypes.STRING,
    TransID: DataTypes.STRING,
    TransTime: DataTypes.STRING,
    TransAmount: DataTypes.DOUBLE,
    BusinessShortCode: DataTypes.STRING,
    BillRefNumber: DataTypes.STRING,
    InvoiceNumber: DataTypes.STRING,
    ThirdPartyTransID: DataTypes.STRING,
    MSISDN: DataTypes.STRING,
    FirstName: DataTypes.STRING,
    MiddleName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    OrgAccountBalance: DataTypes.DOUBLE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {});
  // eslint-disable-next-line no-unused-vars
  MpesaC2B.associate = (models) => {
    MpesaC2B.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    MpesaC2B.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });
  };
  return MpesaC2B;
};
