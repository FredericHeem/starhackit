describe('Reset Password', function () {
    it('password too small', function (client) {
        client.page.resetPassword().withResetCode("0123456789123456")
            .waitForElementVisible('.reset-password-view', 5000)
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementVisible('.reset-password-error-view', 5000)
    });

});
