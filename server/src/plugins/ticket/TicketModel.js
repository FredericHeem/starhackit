module.exports = function(sequelize, DataTypes) {
  let Ticket = sequelize.define(
    "Ticket",
    {
      subject: DataTypes.TEXT,
      body: DataTypes.TEXT
    },
    {
      tableName: "ticket",
      underscored: true
    }
  );
  Ticket.associate = function(models) {
    Ticket.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
        allowNull: false
      }
    });
    models.User.hasMany(models.Ticket, {
      foreignKey: {
        name: "user_id",
        allowNull: true
      }
    });
  };
  return Ticket;
};
