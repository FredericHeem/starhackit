import _ from 'lodash';
import chai from 'chai';
const expect = chai.expect;
import assert from 'assert';
import testMngr from '~/test/testManager';

describe('GroupModel', function() {
    const app = testMngr.app;
    const models = app.data.sequelize.models;
    let userId;
    before(async () => {
        await testMngr.start();
        let users = await models.User.findAll({
            attributes: [
                'id'
            ]
        });
        expect(users.length).to.be.above(0);
        //console.log(users);
        userId = users[0].get().id;
        assert(userId);
    });
    after(async () => {
        await testMngr.stop();
    });

    it('should list all groups', async () => {
        let res = await models.Group.findAll({
            attributes: [
                'id',
                'name'
            ]
        });
        expect(res.length).to.be.above(0);
        _.each(res, item => {
            const group = item.get();
            //console.log('group: ', item.get());
            expect(group.name).to.exist;
        });
    });
    it('should list permission for a given group', async () => {
        const groupName = 'Admin';
        let res = await models.Group.getPermissions(groupName);
        const group = res.get();
        //console.log("group: ", res.get());
        expect(group).to.exist;
        expect(group.Permissions.length).to.be.above(0);
        _.each(group.Permissions, item => {
            const permission = item.get();
            assert(permission);
            //console.log("permissions: ", permission);
            expect(permission.name).to.exist;
            expect(permission.resource).to.exist;
        });
    });
    it('should list all permissions', async () => {
        let res = await models.Permission.findAll({
            attributes: [
                'id',
                'name',
                'resource'
            ]
        });
        expect(res.length).to.be.above(0);
        _.each(res, item => {
            //console.log('permission: ', item.get());
            assert(item.get().name);
        });
    });
    it('should count permissions', async () => {
        let count = await models.Permission.count();
        expect(count).to.be.above(0);
    });
    it('should list all groups permissions', async () => {
        let res = await models.GroupPermission.findAll({
            attributes: [
                'group_id',
                'permission_id'
            ]
        });
        _.each(res, item => {
            //console.log('group permission: ', item.get());
            assert(item.get().group_id);
            assert(item.get().permission_id);
        });
    });
    it('should not add an unknown group', done => {
        models.GroupPermission.add('GroupUnkknown', ['/users get post']).catch(err => {
            //console.log(err);
            expect(err.name).to.be.equal('GroupNotFound');
        }).then(done, done);
    });
    it('should not add an unknown permission', done => {
        models.GroupPermission.add('Admin', ['/usersnotexit get post']).catch(err => {
            //console.log(err);
            expect(err.name).to.be.equal('PermissionNotFound');
        }).then(done, done);
    });
    it('should list all user - groups', async () => {
        let res = await models.UserGroup.findAll({
            attributes: [
                'user_id',
                'group_id'
            ]
        });
        expect(res.length).to.be.above(0);
        _.each(res, item => {
            //console.log('user group: ', item.get());
            assert(item.get().user_id);
            assert(item.get().user_id);
        });
    });
    async function checkUserPermission(param) {
        let authorized = await models.User.checkUserPermission(param.userId, param.routePath, param.method);
        expect(authorized).to.be.equal(param.authorized);
    }
    it('should check permission given a user id, a route path and a method', done => {
        const param = {
            userId: userId,
            routePath: '/users/:id',
            method: 'get',
            authorized: true
        };
        return checkUserPermission(param).then(done, done);
    });
    it('should get all groups for a given user', async () => {
        let res = await models.User.find({
            include: [{ model: models.Group }],
            where: { id: userId }
        });
        expect(res).to.exist;
        expect(res.get().username).to.exist;
        //console.log(res.get().username);
        expect(res.get().Groups).to.exist;
        expect(res.get().Groups.length).to.be.above(1);
        _.each(res.get().Groups, item => {
            //console.log('group: ', item.get().name);
            assert(item.get().name);
        });
    });
    it('should get all permission for a given user ', async () => {
        let res = await models.User.getPermissions('admin');
        const user = res.get();
        //console.log(user);
        _.each(user.Groups, item => {
            const group = item.get();
            //console.log("group:", group.name);
            //console.log("group:", group.permissions);
            _.each(group.permissions, itemPermission => {
                const permission = itemPermission.get();
                assert(permission.name);
                assert(permission.resource);
                //console.log("permission name:%s, resource ", permission.name, permission.resource);
            });
        });
    });
});
