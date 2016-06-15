var raml2html = require('raml2html');
var configWithDefaultTemplates = raml2html.getDefaultConfig();
console.log('raml2html: ', configWithDefaultTemplates);
//var configWithCustomTemplates = raml2html.getDefaultConfig('my-custom-template.nunjucks', __dirname);
var source = ['./src/plugins/users/user/raml/users.raml']
// source can either be a filename, url, file contents (string) or parsed RAML object
raml2html.render(source, configWithDefaultTemplates).then(function(result) {
  // Save the result to a file or do something else with the result
  console.log('raml2html done: ', result);
}, function(error) {
  // Output error
  console.error(error)
});
