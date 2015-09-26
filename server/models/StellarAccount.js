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
      findByUser:findByUser
    }
  },
  {
    underscored: true
  });

  function findByUser(){

  }

  return StellarAccount;
};
