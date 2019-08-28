<img alt="Starhack" src="./client/src/app/parts/landing/img/starhackit-logo-text.png" height="250">

StarHackIt
==========
StarHackIt is a fullstack starter kit composed of:

* React web frontend
* React native mobile app 
* Node backend
* Deployment by Ansible with docker images

[![Join the chat at https://gitter.im/FredericHeem/starhackit](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/FredericHeem/starhackit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Fullstack web application starter kit written in modern Javascript with react and node.js with the following features:

* Authentication: username/password, facebook, google authentication etc ...
* Authorization: scheme using user, group and permission  
* Scalable by using a micro services based architecture, a.k.a message queues
* Relational database: postgres, mysql, sqlite, mssql etc, ...
* Logging

## Frontend Technologies

* [React](https://facebook.github.io/react/): libraries to build user interfaces.
* [Mobx](https://mobx.js.org/): Simple, scalable state management
* [Webpack](http://webpack.github.io/): module bundler for the browser
* [Emotion](https://emotion.sh): Style React Components with Style.
* [i18next](http://i18next.com/): internationalization

For more information about the frontend, see its [README](client/README.md)

## Mobile App Technologies

For more information about the mobile app, see its [README](mobile/README.md)

## Backend Technologies

* [Koa](http://koajs.com/): next generation web framework for Node.js.
* [Sequelize](http://docs.sequelizejs.com/en/latest/): Object Relationship Management (ORM) supporting majors relational SQL database.
* [PostgreSQL](http://www.postgresql.org/): the world's most advanced open source relational database.
* [Passport](http://passportjs.org/): authentication framework with more than 140 authentication strategies: username/password, facebook , google, github etc ...
* [Winston](https://github.com/winstonjs/winston): a multi-transport async logging library.
* [Nodemailer](https://github.com/andris9/Nodemailer): send email with various provider.

For more information about the backend, see its [README](server/README.md)

## Dev Technologies

* [Docker](https://www.docker.com/): Debug your app, not your environment
* [Babel](https://babeljs.io/): A es6/es7 compiler.
* [Mocha](http://mochajs.org/): test framework.
* [Karma](https://karma-runner.github.io): a productive testing environment to developers
* [Nightwatch](http://nightwatchjs.org/): End-to-End tests in Node.js quickly and effortlessly that run against a Selenium server
* [Sinon](http://sinonjs.org/): test spies, stubs and mocks.
* [Eslint](http://eslint.org/): The pluggable linting utility for JavaScript and JSX.
* [Travis](https://travis-ci.org/): Test and deploy. [![Build Status](https://travis-ci.org/FredericHeem/starhackit.svg?branch=master)](https://travis-ci.org/FredericHeem/starhackit)
* [CodeClimate](https://codeclimate.com): Automated code review [![Code Climate](https://codeclimate.com/github/FredericHeem/starhackit/badges/gpa.svg)](https://codeclimate.com/github/FredericHeem/starhackit)
[![Test Coverage](https://codeclimate.com/github/FredericHeem/starhackit/badges/coverage.svg)](https://codeclimate.com/github/FredericHeem/starhackit/coverage)
* [Coveralls](https://coveralls.io): [![Coverage Status](https://coveralls.io/repos/FredericHeem/starhackit/badge.svg?branch=master)](https://coveralls.io/r/FredericHeem/starhackit?branch=master)
* 

> The frontend and the backend are two separate projects with their own set of dependencies. One can use the frontend with another existing backend, or use the backend with another frontend stack.

# Workflow

## Clone the source code

To get the latest code, grab it by cloning the repository from GitHub:

    $ git clone https://github.com/FredericHeem/starhackit.git yourproject
    $ cd yourproject

## Deployment

See [Ansible README.md](deploy/playbook/README.md)

# License

See [LICENSE](LICENSE)

# Author

Crafted with passion by [Frederic Heem](https://github.com/FredericHeem)
