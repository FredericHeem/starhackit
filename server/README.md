Node.js Starter Kit
==================

Backend Starter Kit written in Node.js with the following features:

* **ES6/ES7** ready: async/await, classes, arrow function, template strings etc ...
* **SQL** Relational database support with  [Sequelize](http://docs.sequelizejs.com/en/latest/)
* **Koa** web server, the next generation web server with async/await support.
* **REST API** designed with [RAML](http://raml.org/), produce a human friendly [API documentation](http://starhack.it/api/v1/doc/api.html) and a **Mock Server** for frontend developer.
* [Json Web Token](https://jwt.io/) authentication.
* **Social Authentication** with Facebook, Google, etc .. Powered by [passport](http://passportjs.org/)
* Fined-grained **Authorization** based on users, groups and resources.
* Scalable by using a **Micro Services** based architecture. Orchestrating with [pm2](http://pm2.keymetrics.io/)
* **Logging** with timestamp and filename.
* **CORS** support with [kcors](https://github.com/koajs/cors)

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

# Mind Map

![Mind Map BackEnd StarHackit](https://atlas.mindmup.com/2016/08/8fd0abd04ece013446842b9f15b052d7/starhackit_backend/thumb.png)

# Configuration

## Database

This project can use the most popular SQL databases such as PostgreSQL, MySQL, Oracle, MSSQL and Sqlite. This is achieved with [Sequelize](http://docs.sequelizejs.com/en/latest/), the most popular [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) for Node.js


For rapid prototyping, the easiest database to configure is sqlite. In production, StarHackIt is using PostgreSQL.

### Sqlite configuration

```
"db":{
  "driver": "sqlite3",
  "dialect":"sqlite",
  "database": "dev",
  "user": "user",
  "logging": true,
  "storage": "./db.dev.sqlite"
}

```
### Postgresql configuration

Here is an example of the configuration for Postgres:

```
"db":{
  "driver": "pg",
  "dialect":"postgres",
  "database": "dev",
  "user": "user",
  "password": "password",
  "host": "localhost",
  "port": "5432",
  "logging": true,
  "pool": {
    "maxConnections": 100,
    "maxIdleTime": 60
  }
}
```

## Message Queue

A use case for using a RabbitMq in this project is to send an email during registration. It decouples the act of requesting an action and executing it. That solves a bunch of issues,  for instance, when the mail server is not reachable or down, the [job](src/plugins/users/jobs/mail/MailJob.js) who is processing the email expedition can retry until the mail service is restored.

Example of configuration:

```
"rabbitmq":{
  "url":"amqp://192.168.99.100"
}
```

## Sending Email
Sending email is a very common task for an application. For instance, an email is sent during registration, when a user requests a new password etc ...

The project is leveraging [nodemailer](http://nodemailer.com/) which makes sending e-mail easy as cake:

```
"mail": {
  "from": "StarHackIt <notification@yourproject.com>",
  "signature": "The Team",
  "smtp": {
    "service": "Mailgun",
    "auth": {
      "user": "postmaster@yourproject.mailgun.org",
      "pass": "2109aef076a992169436141d0aba0450"
    }
  }
}
```

Please have a look at the [nodemailer documentation](https://github.com/nodemailer/nodemailer) for more information about how to use another mail provider.

## Social authentication

Beside creating an account with username and password, this starter kit supports social authentication such as Facebook, Google, Twitter etc ...

[passportjs](http://passportjs.org/) has more than 300 different strategies to choose from.

Example of configuration for the Facebook authentication:

```
"authentication":{
  "facebook":{
    "clientID":"",
    "clientSecret":"",
    "callbackURL": "http://localhost:3000/v1/auth/facebook/callback"
  }
}
```

## Redis session store

*Redis* can be used to quickly store and retrieve session data. This allows for zero down time in production when the api server is restarted.

Here is how to configure Redis:

```
"redis":{
  "url": "redis://localhost:6379"
},
```

## Json Web Token

[Json Web Token](https://jwt.io/) is a modern alternative to HTTP cookie for authentication purposes.

[node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) is the node library which implements such a protocol.

A sequence diagram a worth a thousand words:

![Json Web Token Sequence Diagram](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgSldUIEF1dGhlbnRpY2F0aW9uIFNlcXVlbmNlCgpDbGllbnQtPlNlcnZlcjogUE9TVCAvYXV0aC9sb2dpbiBcbnVzZXJuYW1lOiJwaXBwbyJcbnBhc3N3b3JkOiAiAAMIIgoAPAYtPkRCOiBmaW5kIHVzZXIgYnkAAwVuYW1lCkRCAF4KZm91ABsIAFEFCm5vdGUgcmlnaHQgb2YgAIEHCHRva2VuID0gand0LnNpZ24odXNlciwgc2VjcmV0LCBvcHRpb25zKQB0CQCBSQY6IDIwMCBPS1xuADsGOiAiQTFCMkMzRDRFNTY3ODkwIgCBUQY6ewCBVAkgAIFXB319Cg&s=modern-blue)

Please change the following configuration according to your need, especially the *secret*.

For a list of all available options, please consult the [node-jsonwebtoken documentation](https://github.com/auth0/node-jsonwebtoken#usage)

```
"jwt": {
  "secret": "I love shrimp with mayonnaise",
  "options": {
    "expiresIn": "15 days"
  }
}
```

## CORS
[Cross-origin resource sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) is implemented with the *koa* middleware [kcors](https://github.com/koajs/cors)

See [kors options](https://github.com/koajs/cors#corsoptions) for the list of all options.

Here is a typical configuration:

```
"cors":{
  "credentials": true
},
```

## Docker containers

### For development
To install the docker containers for the various services such as RabbitMq and Postgres on the local machine, the [DevLab](https://github.com/TechnologyAdvice/DevLab) project is being used to containerize the development workflow, see its configuration file: [devlab.yml](server/devlab.yml)

    # cd server
    # npm run devlabinstall

To check that the containers are running:

```
# docker ps
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS              PORTS                                               NAMES
290fe4c70fea        kiasaki/alpine-postgres   "/docker-entrypoint.s"   8 days ago          Up 8 days           0.0.0.0:5432->5432/tcp                              devlab_postgres_frederic_1471545611147
4dfd33e1e48d        gonkulatorlabs/rabbitmq   "/usr/bin/wrapper"       8 days ago          Up 8 days           5671/tcp, 15671-15672/tcp, 0.0.0.0:5672->5672/tcp   devlab_rabbitmq_frederic_1471545611147
```

### For production

To build a production dockerized system, please use `docker-compose` to build, start and stop containers:

    # docker-compose build
    # docker-compose up

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

    # node scripts/apidoc.js

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

## GraphQL

    # npm install -g postgraphql
    # postgraphql postgres://postgres:password@192.168.99.100:5432/dev --development


## Database migration

> Database migration are **not** necessary for development environment but only for system already in production.

Run the following command to migrate the database:

    $ ./node_modules/.bin/sequelize db:migrate

### Database rollback
When the new database update breaks in production, it's very handy to rollback as quick as possible:

    $ ./node_modules/.bin/sequelize db:migrate:undo
