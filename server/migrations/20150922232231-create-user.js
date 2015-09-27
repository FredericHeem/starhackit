'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false
      },
      facebookId: {
        type: Sequelize.TEXT,
        unique: true
      },
      githubId: {
        type: Sequelize.TEXT,
        unique: true
      },
      twitterId: {
        type: Sequelize.TEXT,
        unique: true
      },
      googleId: {
        type: Sequelize.TEXT,
        unique: true
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false
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
    return queryInterface.dropTable('users');
  }
};
