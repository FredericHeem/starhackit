var _ = require('lodash');
var path = require('path');
var api = require('raml-mocker-server');

var sources = ['users/raml/users.raml', 'dbSchema/raml/db.explorer.raml'];

sources = _.map(sources, function(source) {
  return path.join(__dirname, '/../src/plugins', source);
});

const options = {
  port: 9000,
  files: sources,
  path: null,
  debug: true,
  //prioritizeBy: 'example',
  formats: {
    username: function(Faker) {
      return Faker.internet.userName();
    },
    firstName: function(Faker) {
      return Faker.name.findName();
    },
    email: function(Faker) {
      return Faker.internet.email();
    },
    datePast: function(Faker) {
      return Faker.date.past();
    },
    jwtToken: function(Faker) {
      return Faker.random.alphaNumeric(64);
    },
  },
};

var callback = function(app) {
  // Express app could be used to configure more paths
  console.log('All RAML files parsed and API endpoints defined');
};

// returns created server
var server = api(options, callback);
