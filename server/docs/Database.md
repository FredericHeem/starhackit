## Database

This project can use the most popular SQL databases such as PostgreSQL, MySQL, Oracle, MSSQL and Sqlite. This is achieved with [Sequelize](http://docs.sequelizejs.com/en/latest/), the most popular [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) for Node.js

## Install and Start

Start the postgres database and other services:

    $ npm run docker:up

Connect to the database:

    $ psql "postgres://postgres:password@localhost:6432/dev?sslmode=disable"

## Configuration

Here is an example of the configuration for Postgres:

```
"db":{
    "url": "postgres://postgres:password@localhost:6432/dev?sslmode=disable",
    "options": {
      "logging": true
    }
}
```

## Migration

> Database migration are **not** necessary for development environment but only for system already in production.

Run the following command to migrate the database:

    $ npm run db:migrate

## Creating a new data model

[sequelize-cli](https://github.com/sequelize/cli) helps to manage the database migration and rollback.

By using the _model:create_ command, a new sequelize model is created alongside its migration script for database update and rollback

    $ ./node_modules/.bin/sequelize model:create --name User --attributes "name:text, password:text"

    $ ./node_modules/.bin/sequelize model:create --name UserPending --attributes "username:string(64), email:string(64), password:string, code:string(16)"

    $ ./node_modules/.bin/sequelize model:create --name PasswordReset --attributes "user_id:integer, token:string(32)"

2 files will be generated:

- the javascript sequelize model in the _models_ directory
- the sql migration script in the _migrations_ directory

Eventually change the sql table name to _underscore_case_
