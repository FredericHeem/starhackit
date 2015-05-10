module.exports = function (app) {
  "use strict";
  var log = app.log.get(__filename);
  var Sequelize = require('sequelize');
  var sequelize = app.data.sequelize;
  var models = sequelize.models;
  
  var Permission = sequelize.define('permission', {
    id: { 
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { 
      type: Sequelize.STRING,
      unique: true
    },
    resource: {
      type: Sequelize.STRING,      
    },
    description: { 
      type: Sequelize.STRING 
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
    PATCH: { 
      type: Sequelize.BOOLEAN, 
      allowNull: false, 
      defaultValue: false 
    },
    PUT: { 
      type: Sequelize.BOOLEAN, 
      allowNull: false, 
      defaultValue: false 
    },
    DELETE: { 
      type: Sequelize.BOOLEAN, 
      allowNull: false, 
      defaultValue: false 
    },
  },  {
  classMethods: {
    seedDefault:seedDefault,
    findByName: findByName,
    findByResourceName: findByResourceName,
    associate: function(models) {
      Permission.belongsToMany(models.group,{ "through" : models.groupPermission, foreignKey: "permissionId"});
    }
   }
  });
  
  function seedDefault() {
    var permissionsJson = require('../fixtures/permissions.json');
    log.debug('seedDefault: ', JSON.stringify(permissionsJson, null, 4));
    return app.data.utils.upsertRows(Permission,permissionsJson);
  }

  function findByName(permissionName) {
    console.log("findByName", permissionName);
    return Permission.find({where: { "name": permissionName } })
    .then(function(permissionFound){
      //console.log("AAaAaAAaaaaAA", permissionFound.get());
      return permissionFound;
    })  
  }
  
  function findByResourceName(resourceName) {
    return Permission.find({where: { "resource": resourceName } });   
  }
  
 
  return Permission;
};