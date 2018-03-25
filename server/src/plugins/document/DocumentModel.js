module.exports = function(sequelize, DataTypes) {
  const Document = sequelize.define(
    "Document",
    {
      type: DataTypes.TEXT, 
      file_type: DataTypes.TEXT,
      name: DataTypes.TEXT,
      size: DataTypes.BIGINT,
      content: DataTypes.BLOB,
      meta: DataTypes.JSONB
    },
    {
      tableName: "document",
      underscored: true
    }
  );
  Document.associate = function(models) {
    Document.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
        allowNull: false
      }
    });
    models.User.hasMany(models.Document, {
      foreignKey: {
        name: "user_id",
        allowNull: true
      }
    });
  };
  return Document;
};
