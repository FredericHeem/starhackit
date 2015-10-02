var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;
var assert = require('assert');

describe('GroupModel', function(){
  "use strict";
  this.timeout(20e3);

  var testMngr = require('../testManager');

  var app = testMngr.app;
  var models = app.data.sequelize.models;

  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  it('should list all groups', function(done){
    models.Group.findAll({attributes: [ 'id', 'name' ]})
    .then(function(res){
      expect(res.length).to.be.above(0);
      _.each(res, function(item){
        var group = item.get();
         console.log("group: ", item.get());
         expect(group.name).to.exist;
      });
    })
    .then(done, done);
  });

  it('should list permission for a given group', function(done){
    var groupName = "Admin";
    models.Group.getPermissions(groupName)
    .then(function (res) {
      var group = res.get();
      //console.log("group: ", res.get());
      expect(group).to.exist;
      expect(group.Permissions.length).to.be.above(0);
      _.each(group.Permissions, function (item) {
        var permission = item.get();
        assert(permission);
        //console.log("permissions: ", permission);
        expect(permission.name).to.exist;
        expect(permission.resource).to.exist;
      });
    })
    .then(done, done);
  });

  it('should list all permissions', function(done){
    models.Permission.findAll({attributes: [ 'id', 'name', 'resource' ]})
    .then(function(res){
      expect(res.length).to.be.above(0);
      _.each(res, function(item){
         console.log("permission: ", item.get());
      });
    })
    .then(done, done);
  });

  it('should count permissions', function(done){
    models.Permission.count()
    .then(function(count){
      expect(count).to.be.above(0);
    })
    .then(done, done);
  });



  it('should list all groups permissions', function(done){

    models.GroupPermission.findAll({attributes: [ 'group_id', 'permission_id' ]})
    .then(function(res){
      //expect(res.length).to.be.above(0);
      _.each(res, function(item){
         console.log("group permission: ", item.get());
      });
    })
    .then(done, done);
  });

  it('should not add an unknown group', function(done){
    models.GroupPermission.add("GroupUnkknown", ['/users get post'])
    .catch(function(err){
     console.log(err);
     expect(err.name).to.be.equal("GroupNotFound");
    })
    .then(done, done);
  });

  it('should not add an unknown permission', function(done){
    models.GroupPermission.add("Admin", ['/usersnotexit get post'])
    .catch(function(err){
     console.log(err);
     expect(err.name).to.be.equal("PermissionNotFound");
    })
    .then(done, done);
  });

  it('should list all user - groups ', function(done){
    models.UserGroup.findAll({attributes: [ 'user_id', 'group_id' ]})
    .then(function(res){
      expect(res.length).to.be.above(0);
      _.each(res, function(item){
         console.log("user group: ", item.get());
      });
    })
    .then(done, done);
  });


  function checkUserPermission(param){
    return models.User.checkUserPermission(param.userId, param.routePath, param.method)
    .then(function(authorized){
      expect(authorized).to.be.equal(param.authorized);
    });
  }

  it('should check permission given a user id,  a route path and a method', function(done){
   var param = {
     userId:1,
     routePath:"/users/:id",
     method:"get",
     authorized:true
   };

   return checkUserPermission(param)
    .then(done, done);
  });

  it('should get all groups for a given user', function(done){
    var user_id = 1;
    return models.User.find({
          include: [
                    {
                    model: models.Group,
                    }],
          where: {
              id: user_id
            }
        }).then(function(res) {
          console.log(res)
          expect(res).to.exist;
          expect(res.get().username).to.exist;
          console.log(res.get().username);
          expect(res.get().Groups).to.exist;
          expect(res.get().Groups.length).to.be.above(1);
          _.each(res.get().Groups, function (item) {
            console.log("group: ", item.get().name);
          });

        })
        .then(done, done);
  });

  it('should get all permission for a given user ', function(done){
    models.User.getPermissions("admin")
    .then(function(res){
      var user = res.get();
      console.log(user);
      _.each(user.Groups, function(item){
        var group = item.get();
        //console.log("group:", group.name);
        //console.log("group:", group.permissions);
        _.each(group.permissions, function(item){
          var permission = item.get();
          chai.assert(permission.name);
          chai.assert(permission.resource);
          //console.log("permission name:%s, resource ", permission.name, permission.resource);
        });
      });
    })
    .then(done, done);
  });
});
