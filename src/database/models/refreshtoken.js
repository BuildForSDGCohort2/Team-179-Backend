module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    refToken: DataTypes.STRING,
    expires: DataTypes.DATE,
    revoked: DataTypes.BOOLEAN,
    revokedAt: DataTypes.DATE,
    replaceToken: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  }, {});
  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };
  return RefreshToken;
};
