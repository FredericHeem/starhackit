'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('stellar_account', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      publicKey: {
        type: Sequelize.STRING(56)
      },
      privateKey: {
        type: Sequelize.STRING(56)
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface/*, Sequelize*/) {
    return queryInterface.dropTable('stellar_account');
  }
};
