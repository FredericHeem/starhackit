//checks whether the test has been called by mocha from the command line
//if so initialises database
module.exports = function(testManager) {
  if(require.main.filename.substr(-5) === 'mocha') {
    before(function(done) {
      testManager.start().then(done, done);
    });

    after(function(done) {
      testManager.stop().then(done, done);
    });
  }
};

