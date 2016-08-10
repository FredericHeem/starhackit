var _ = require('lodash');
var raml2html = require('raml2html');
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var shell = require('shelljs');

var configWithDefaultTemplates = raml2html.getDefaultConfig();

var sources = [
  'api.raml',
  'users/raml/users.raml',
  'dbSchema/raml/db.explorer.raml'
];

sources = _.map(sources, function(source){
  return path.join(__dirname, '/../src/plugins', source)
})

var outputPath = 'build/api/v1/doc';
shell.mkdir('-p', outputPath);

console.log('sources: ', sources);
Promise.all(_.map(sources, function(source){
  //console.log('raml2html in: ', source);
  return raml2html.render(source, configWithDefaultTemplates).then(function(result) {
    //console.log('raml2html result: ', result);
    var outputFile = path.basename(source, '.raml');
    let resultFilename = path.join(outputPath, outputFile + ".html");
    console.log('raml2html writing to file: ', resultFilename);
    fs.writeFileSync(resultFilename, result);
  }, function(error) {
    // Output error
    console.error(error);
    throw error;
  });
}))
