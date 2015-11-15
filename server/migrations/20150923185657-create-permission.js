'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      resource: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      POST: {
        type: Sequelize.BOOLEAN
      },
      GET: {
        type: Sequelize.BOOLEAN
      },
      PUT: {
        type: Sequelize.BOOLEAN
      },
      PATCH: {
        type: Sequelize.BOOLEAN
      },
      DELETE: {
        type: Sequelize.BOOLEAN
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('permissions');
  }
};
