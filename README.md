StarHackIt is a ES6/ES7 React/Node starter kit
==============================================

[![Join the chat at https://gitter.im/FredericHeem/starhackit](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/FredericHeem/starhackit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Fullstack web application starter kit written in es6/es7 with react and node.js with the following features:

* Authentication: username/password, facebook, google authentication etc ...
* Authorization: scheme using user, group and permission  
* Scalable by using a micro services based architecture, a.k.a message queues
* Relational database: postgres, mysql, sqlite, mssql etc, ...
* Logging


## Frontend Technologies

* [React](https://facebook.github.io/react/): a facebook library to build user interfaces.
* [Redux](http://redux.js.org/): predictable state container for JavaScript apps.
* [Webpack](http://webpack.github.io/): module bundler for the browser
* [Stylus](http://stylus-lang.com/): expressive, dynamic, robust CSS
* [i18next](http://i18next.com/): internationalization


## Backend Technologies

* [Koa](http://koajs.com/): next generation web framework for Node.js.
* [Sequelize](http://docs.sequelizejs.com/en/latest/): Object Relationship Management (ORM) supporting majors relational SQL database.
* [PostgreSQL](http://www.postgresql.org/): the world's most advanced open source relational database.
* [RabbitMq](https://www.rabbitmq.com/): messaging system.
* [Passport](http://passportjs.org/): authentication framework with more than 140 authentication strategies: username/password, facebook , google, github etc ...
* [Winston](https://github.com/winstonjs/winston): a multi-transport async logging library.
* [Nodemailer](https://github.com/andris9/Nodemailer): send email with various provider.

## Dev Technologies

* [Babel](https://babeljs.io/): A es6/es7 compiler.
* [Gulp](http://gulpjs.com/): automate and enhance your workflow.
* [Mocha](http://mochajs.org/): test framework.
* [Karma](https://karma-runner.github.io): a productive testing environment to developers
* [Nightwatch](http://nightwatchjs.org/): End-to-End tests in Node.js quickly and effortlessly that run against a Selenium server
* [Sinon](http://sinonjs.org/): test spies, stubs and mocks.
* [Eslint](http://eslint.org/): The pluggable linting utility for JavaScript and JSX.
* [Travis](https://travis-ci.org/): Test and deploy. [![Build Status](https://travis-ci.org/FredericHeem/starhackit.svg?branch=master)](https://travis-ci.org/FredericHeem/starhackit)
* [CodeClimate](https://codeclimate.com): Automated code review [![Code Climate](https://codeclimate.com/github/FredericHeem/starhackit/badges/gpa.svg)](https://codeclimate.com/github/FredericHeem/starhackit)
[![Test Coverage](https://codeclimate.com/github/FredericHeem/starhackit/badges/coverage.svg)](https://codeclimate.com/github/FredericHeem/starhackit/coverage)
* [Coveralls](https://coveralls.io): [![Coverage Status](https://coveralls.io/repos/FredericHeem/starhackit/badge.svg?branch=master)](https://coveralls.io/r/FredericHeem/starhackit?branch=master)
* [DevLab](https://github.com/TechnologyAdvice/DevLab): Containerize your development workflow.
* [Trevor](https://github.com/vdemedes/trevor): Your own Travis CI to run tests locally.

# Workflow

## Yeoman generator

The easiest way to bootstrap your application is to use the [Starhackit Yeoman generator](https://github.com/FredericHeem/generator-starhackit).

First install *yo* and *generator-starhackit* globally:

```bash
npm install -g yo generator-starhackit
```

Finally, initiate the generator and answer the questions about your project:

```bash
mkdir yourproject && cd $_
yo starhackit
```

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
## Backend

Before running the backend, check and modify the configuration located at [server/config/default.json](server/config/default.json).
Don't forget to correctly set the *rabbitmq* server location.

To start the backend:

    # cd server
    # npm start

To test the backend:

    # npm test

It will not only test the code, but also checks the source code with eslint and generates a code coverage report located at `coverage/lcov-report/index.html`

For more information about the backend, see its [README](server/README.md)

## Frontend

To run the frontend webserver:

    # npm start

For more information about the frontend, see its [README](client/README.md)

## Deployment

See [Ansible README.md](deploy/ansible/README.md)

# License

See [LICENSE](LICENSE)

# Author

Crafted with passion by [Frederic Heem](https://github.com/FredericHeem)
