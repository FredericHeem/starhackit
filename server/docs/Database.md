## Database

This project can use the most popular SQL databases such as PostgreSQL, MySQL, Oracle, MSSQL and Sqlite. This is achieved with [Sequelize](http://docs.sequelizejs.com/en/latest/), the most popular [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) for Node.js


### Postgresql configuration

Here is an example of the configuration for Postgres:

```
"db":{
    "url": "postgres://postgres:password@localhost:6432/dev?sslmode=disable",
    "options": {
      "logging": true
    }
}
```

Install and configure Postgres on a mac:

    $ brew install postgres

Create a database:

    $ npm run db:create


## Database migration

> Database migration are **not** necessary for development environment but only for system already in production.

Run the following command to migrate the database:

    $ npm run db:migrate

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
