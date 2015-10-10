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
      firstName: {
        type: Sequelize.STRING(64)
      },
      lastName: {
        type: Sequelize.STRING(64)
      },
      username: {
        type: Sequelize.STRING(64),
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(64),
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
      passwordHash: {
        type: Sequelize.TEXT,
        allowNull: true
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
