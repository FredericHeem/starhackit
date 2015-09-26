'use strict';
module.exports = function(sequelize, DataTypes) {
  var StellarAccount = sequelize.define('StellarAccount', {
    publicKey: DataTypes.STRING(56),
    privateKey: DataTypes.STRING(56)
  }, {
    tableName: "stellar_account",
    classMethods: {
      associate: function(models) {
        StellarAccount.belongsTo(models.User, {
          foreignKey: {
            name: "user_id",
            allowNull: true
          }
        });
        models.User.hasMany(models.StellarAccount,{
          foreignKey: {
            name: "user_id",
            allowNull: true
          }
        });

      },
      findByPublicAddress:findByPublicAddress,
      getByUserId:getByUserId
    }
  },
  {
    underscored: true
  });

  function findByPublicAddress(publicAddress){
    return StellarAccount.find({where: { publicKey: publicAddress } });
  }
  function getByUserId(user_id){
    return StellarAccount.find({where: { user_id: user_id } });
  }
  return StellarAccount;
};
