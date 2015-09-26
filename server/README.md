Node.js starterkit
==================

Backend Starter Kit written in node.js with the following features:

* REST API and Websocket
* Authentication
* Authorization
* Scalable by using a micro services based architecture
* Relational and non relational database.
* Logging

#Workflow

To install all the dependencies:

    # npm install

To test the backend:

    # npm test

It will not only test the code, but also check the source code with jshint and generate a code coverage report located at `coverage/lcov-report/index.html`

To run the webserver:

    # npm start


# Development

[sequelize-cli](https://github.com/sequelize/cli) helps to manage the database migration and rollback.

## Database migration
Run the following command to migrate the database:

    $ ./node_modules/.bin/sequelize db:migrate

## Database rollback
When the new database update breaks in production, it's very handy to rollback as quick as possible:

    $ ./node_modules/.bin/sequelize db:migrate:undo

## Creating a new data model

By using the *model:create* command, a new sequelize model is created alongside its migration script for database update and rollback

    $ ./node_modules/.bin/sequelize model:create --name User --attributes "name:text, password:text"

2 files will be generated:
  * the javascript sequelize model in the *models* directory
  * the sql migration script in the *migrations* directory

Eventually change the sql table name to *underscore_case*
