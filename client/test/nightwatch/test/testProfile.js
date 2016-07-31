describe('Profile', function () {
    before(function (client, done) {
        client.page.login().login(done);
    });

    after(function (client, done) {
        client.page.logout().logout(done)
    });

    it('read and save profile', function (client) {
        client.page.profile().navigate()
            .waitForElementVisible('.profile-page', 5000)
            .assert.title('My Profile - StarHackIt')
            .setValue('@biographyInput', 'My Bio')
            .click('@submit')

    });

    it('save biography too long', function (client) {
        client.page.profile().navigate()
            .waitForElementVisible('.profile-page', 5000)
            .setValue('@biographyInput', 'abcdefhigk'.repeat(10))
            .click('@submit')

    });
});
