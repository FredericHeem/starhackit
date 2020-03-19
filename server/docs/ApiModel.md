# API - RAML

The REST API implemented by this backend is designed and modeled with [RAML](http://raml.org/) which stands for Rest API Modeling Language.
From a file describing the API such as the [user's API](src/plugins/users/raml/users.raml), several dedicated tools will perform the following benefits:

* `npm run doc`: The [API documentation in HTML](http://starhack.it/api/v1/doc/api.html)
* `npm run mocker`: A mock server that will responds to web browser according the API specification, useful for frontend developers which can start before the backend is fully implemented.
* A mock client which verifies that the backend implemented correctly the API.

## REST API HTML documentation

The REST API HTML documentation is generated with the following command:

    # npm run doc

The result can be found at `build/api.html`

Behind the scene `npm run doc` invokes:

    # node scripts/apidoc.js

To open the documentation, simply run

    # npm run opendoc