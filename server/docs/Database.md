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
