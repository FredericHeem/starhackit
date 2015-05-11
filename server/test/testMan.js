var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');
var Promise = require('bluebird');
// First, you need to instantiate a Mocha instance.
var mocha = new Mocha();
mocha.ui('tdd')
mocha.reporter( 'spec')
mocha.timeout( 10000)
mocha.slow(500)

var testManager = require('./testManager.js')

//Files which need to be ignored
var avoided = [
    "node_modules",
    "testManager.js",
    "testMan.js",
    "restClient.js",
    "mochaCheck.js"
];
 
// Add the tests to the Mocha instance
(addFiles = function(dir){
    fs.readdirSync(dir).filter(function(file){
      if(!~avoided.indexOf(file)){
          if(fs.statSync(dir + '/' + file).isDirectory()){
                addFiles(dir + '/' + file);
            }
            return file.substr(-3) === '.js';
        }
    }).forEach(function(file){
      mocha.addFile(dir + '/' + file);
    });
})(__dirname);

testManager.start()
.then(function() {
  // Now, you can run the tests.
  return Promise.promisify(mocha.run(function(failures){
    console.log(failures)
    testManager.stop(); 
    process.exit(code=0);
  }));
})
.catch(function(err){
  console.log(err)
})

  

