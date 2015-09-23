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
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      GET: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      PUT: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      PATCH: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      DELETE: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
