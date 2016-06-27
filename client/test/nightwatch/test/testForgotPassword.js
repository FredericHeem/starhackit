describe('Forgot Password', function () {

    it('email too small', function (client) {
        client.page.forgotPassword().navigate()
            .waitForElementVisible('.forgot-password-view', 5000)
            .setValue('@emailInput', 'not valid')
            .click('@submit')

        client.assert.containsText('.forgot-password-form', 'The email must be a valid email address')
    });
    it('insert email and submit', function (client) {
        client.page.forgotPassword().navigate()
            .waitForElementVisible('.forgot-password-view', 5000)
            .setValue('@emailInput', 'frederic.heem+starthackit@gmail.com')
            .click('@submit')
            .waitForElementVisible('.forgot-password-check-email-view', 5000)
    });

});
