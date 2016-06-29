Node.js Starter Kit
==================

Backend Starter Kit written in Node.js with the following features:

* **ES6/ES7** ready: async/await, classes, arrow function, template strings etc ...
* REST API designed with [RAML](http://raml.org/), produce a human friendly [API documentation](http://starhack.it/api.html) and a **Mock Server** for frontend developer.
* [Json Web Token](https://jwt.io/) authentication.
* **Social Authentication** with Facebook, Google, etc .. Powered by [passport](http://passportjs.org/)
* Fined-grained **Authorization** based on users, groups and resources.
* Scalable by using a **Micro Services** based architecture. Orchestrating with [pm2](http://pm2.keymetrics.io/)
* **SQL** Relational database support with  [Sequelize](http://docs.sequelizejs.com/en/latest/)
* **Logging** with timestamp and filename.

# Workflow with npm scripts

These are the main *npm* commands during a standard developer workflow:

| npm command    | details  |
|----------------|----------|
| `npm install`  | Install dependencies  |
| `npm run devlabinstall`  | Install services such as Rabbitmq and Postgresql though docker |
| `npm start`    | Start the backend  |
| `npm test`     |  Run the tests and generate a code coverage |
| `npm run mocha`|  Run the tests |
| `npm run mock`  |  Run a mock server based on the RAML api definition |
| `npm run doc` |  Generate the API HTML documentation |

## Docker containers

To install the docker containers for the various services such as RabbitMq and Postgres on the local machine, the [DevLab](https://github.com/TechnologyAdvice/DevLab) project is being used to containerize the development workflow, see its configuration file: [devlab.yml](server/devlab.yml)


    # cd server
    # npm run devlabinstall

To check that the containers are running:

```
# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                         NAMES
ccd9f559fabd        rabbitmq:latest     "/docker-entrypoint.s"   36 minutes ago      Up 36 minutes       4369/tcp, 25672/tcp, 0.0.0.0:5672->5672/tcp   devlab_rabbitmq_frederic_1446641005596
```

## Start

Before running the backend, check and modify the configuration located at [server/config/default.json](server/config/default.json).
Don't forget to correctly set the *rabbitmq* server location.

To start the backend:

    # cd server
    # npm start

## Test & Code Coverage
To test the backend:

    # npm test

It will not only test the code, but also checks the source code with eslint and generates a code coverage report located at `coverage/lcov-report/index.html`

# API - RAML

The REST API implemented by this backend is designed and modeled with [RAML](http://raml.org/) which stands for Rest API Modeling Language.
From a file describing the API such as the [user's API](src/plugins/users/raml/users.raml), several dedicated tools will perform the following benefits:
* `npm run doc`: The [API documentation in HTML](http://starhack.it/api.html)
* `npm run mock`: A mock server that will responds to web browser according the API specification, useful for frontend developers which can start before the backend is fully implemented.
* A mock client which verifies that the backend implemented correctly the API.

## REST API HTML documentation

The REST API HTML documentation is generated with the following command:
    # npm run doc

The result can be found at `build/api.html`

Behind the scene `npm run doc` invokes:
    # raml2html -i src/plugins/users/raml/users.raml -o build/api.html

To open the documentation, simply run
    # npm run opendoc

## Mock server

Given the RAML describing of an API, [raml-mocker-server](https://github.com/dmitrisweb/raml-mocker-server) will start responding the web client with data that comply with the API.

To start the mock server, run this npm script:
    # npm run mock

This script launches [mock-server.js](scripts/mock-server.js), modify it to eventually change the http port and the `raml` files to select.


# Development

[sequelize-cli](https://github.com/sequelize/cli) helps to manage the database migration and rollback.

## Creating a new data model

By using the *model:create* command, a new sequelize model is created alongside its migration script for database update and rollback

    $ ./node_modules/.bin/sequelize model:create --name User --attributes "name:text, password:text"

    $ ./node_modules/.bin/sequelize model:create --name UserPending --attributes "username:string(64), email:string(64), password:string, code:string(16)"

    $ ./node_modules/.bin/sequelize model:create --name PasswordReset --attributes "user_id:integer, token:string(32)"

2 files will be generated:
  * the javascript sequelize model in the *models* directory
  * the sql migration script in the *migrations* directory

Eventually change the sql table name to *underscore_case*

## Database migration

> Database migration are **not** necessary for development environment but only for system already in production.

Run the following command to migrate the database:

    $ ./node_modules/.bin/sequelize db:migrate

### Database rollback
When the new database update breaks in production, it's very handy to rollback as quick as possible:

    $ ./node_modules/.bin/sequelize db:migrate:undo
