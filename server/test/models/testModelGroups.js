var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

describe('GroupModel', function(){
  "use strict";
  this.timeout(2e3);

  var TestManager = require('../testManager');

  var testMngr = new TestManager();
  var app = testMngr.app;
  var models = app.data.sequelize.models;

  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  it('should list all groups', function(done){
    models.group.findAll({attributes: [ 'id', 'name' ]})
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
    models.group.getPermissions(groupName)
    .then(function (res) {
      var group = res.get();
      //console.log("group: ", res.get());
      expect(group).to.exist;
      expect(group.permissions.length).to.be.above(0);
      _.each(group.permissions, function (item) {
        var permission = item.get();
        //console.log("permissions: ", permission);
        expect(permission.name).to.exist;
        expect(permission.resource).to.exist;
      });
    })
    .then(done, done);
  });

  it('should list all permissions', function(done){
    models.permission.findAll({attributes: [ 'id', 'name', 'resource' ]})
    .then(function(res){
      expect(res.length).to.be.above(0);
      _.each(res, function(item){
         console.log("permission: ", item.get());
      });
    })
    .then(done, done);
  });

  it('should count permissions', function(done){
    models.permission.count()
    .then(function(count){
      expect(count).to.be.above(0);
    })
    .then(done, done);
  });



  it('should list all groups permissions', function(done){

    models.groupPermission.findAll({attributes: [ 'id','groupId', 'permissionId' ]})
    .then(function(res){
      expect(res.length).to.be.above(0);
      _.each(res, function(item){
         console.log("group permission: ", item.get());
      });
    })
    .then(done, done);
  });

  it('should not add an unknown group', function(done){
    models.groupPermission.add("GroupUnkknown", ['/users get post'])
    .catch(function(err){
     console.log(err);
     expect(err.name).to.be.equal("GroupNotFound");
    })
    .then(done, done);
  });

  it('should not add an unknown permission', function(done){
    models.groupPermission.add("Admin", ['/usersnotexit get post'])
    .catch(function(err){
     console.log(err);
     expect(err.name).to.be.equal("PermissionNotFound");
    })
    .then(done, done);
  });

  it('should list all user - groups ', function(done){
    models.userGroup.findAll({attributes: [ 'id','userId', 'groupId' ]})
    .then(function(res){
      expect(res.length).to.be.above(0);
      _.each(res, function(item){
         console.log("user group: ", item.get());
      });
    })
    .then(done, done);
  });


  function checkUserPermission(param){
    return models.user.checkUserPermission(param.userId, param.routePath, param.method)
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
    var userId = 1;
    return models.user.find({
          include: [
                    {
                    model: models.group,
                    }],
          where: {
              id: userId
            }
        }).then(function(res) {
          //console.log(res)
          expect(res).to.exist;
          expect(res.get().username).to.exist;
          console.log(res.get().username);
          expect(res.get().groups).to.exist;
          expect(res.get().groups.length).to.be.above(1);
          _.each(res.get().groups, function (item) {
            console.log("group: ", item.get().name);
          });

        })
        .then(done, done);
  });

  it('should get all permission for a given user ', function(done){
    models.user.getPermissions("admin")
    .then(function(res){
      var user = res.get();
      //console.log(user);
      _.each(user.groups, function(item){
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
