## Mock server

Given the RAML describing of an API, [raml-mocker-server](https://github.com/dmitrisweb/raml-mocker-server) will start responding the web client with data that comply with the API.

To start the mock server, run this npm script:

    # npm run mocker

This script launches [mocker-server.js](scripts/mocker-server.js), modify it to eventually change the http port and the `raml` files to select.
