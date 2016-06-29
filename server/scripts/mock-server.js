var api = require('raml-mocker-server');

var options = {
    port: 9000,
    files: ['./src/plugins/users/raml/users.raml'],
    path: null,
    debug: true
};

var callback = function (app){
    // Express app could be used to configure more paths
    console.log('All RAML files parsed and API endpoints defined');
};

// returns created server
var server = api(options, callback);
