describe('Verify Email', function () {
    it('code not valid small', function (client) {
        client.page.verifyEmail().withCode("0123456789123456")
            .waitForElementVisible('.registration-complete-page', 5000)
            .waitForElementVisible('.register-complete-error-view', 5000)
    });

});
