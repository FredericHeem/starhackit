Node.js starterkit
==================

Backend Starter Kit written in node.js with the following features:

* ES6/ES7 ready: async/await, classes, arrow function, template strings etc ...
* REST API and Websocket
* Authentication
* Authorization
* Scalable by using a micro services based architecture
* Relational database.
* Logging with timestamp and filename.

#Workflow

To install all the dependencies:

    # npm install

## Backend

To start the backend:

    # npm start

To test the backend:

    # npm test

This command also statically analyze the code with eslint and generate a code coverage in text and html format.

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

    $ ./node_modules/.bin/sequelize model:create --name UserPending --attributes "username:string(64), email:string(64), password:string, code:string(16)"

    $ ./node_modules/.bin/sequelize model:create --name PasswordReset --attributes "user_id:integer, token:string(32)"

2 files will be generated:
  * the javascript sequelize model in the *models* directory
  * the sql migration script in the *migrations* directory

Eventually change the sql table name to *underscore_case*
