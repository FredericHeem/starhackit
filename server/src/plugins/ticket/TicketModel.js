let log = require('logfilename')(__filename);
module.exports = function(sequelize, DataTypes) {
  let Ticket = sequelize.define('Ticket', {
    subject: DataTypes.TEXT,
    body: DataTypes.TEXT
  }, {
    tableName: "tickets",
    classMethods: {
      associate: function(models) {
        log.debug("associate");
        Ticket.belongsTo(models.User, {
          foreignKey: {
            name: "user_id",
            allowNull: true
          }
        });
        models.User.hasMany(models.Ticket,{
          foreignKey: {
            name: "user_id",
            allowNull: true
          }
        });
      }
    }
  });

  return Ticket;
};
