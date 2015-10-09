ES6/ES7 React Node starterkit
==================

Fullstack web application starter kit written in es6/es7 with react and node.js with the following features:

* Authentication: username/password, facebook, google authentication etc ...
* Authorization: scheme using user, group and permission  
* Scalable by using a micro services based architecture, a.k.a message queues
* Relational database: postgres, mysql, sqlite, mssql etc, ...
* Logging

Technologies:

* [React](https://facebook.github.io/react/): a facebook library to build user interfaces.
* [Express](http://expressjs.com/): fast, unopinionated, minimalist web framework for Node.js.
* [Socket.io](http://socket.io/): real-time bidirectional event-based communication.
* [Sequelize](http://docs.sequelizejs.com/en/latest/): Object Relationship Management (ORM) supporting majors relational SQL database.
* [PostgreSQL](http://www.postgresql.org/): the world's most advanced open source relational database.
* [RabbitMq](https://www.rabbitmq.com/): messaging system.
* [Passport](http://passportjs.org/): authentication framework with more than 140 authentication strategies: username/password, facebook , google, github etc ...
* [Winston](https://github.com/winstonjs/winston): a multi-transport async logging library.
* [Nodemailer](https://github.com/andris9/Nodemailer): send email with various provider.
* [Babel](https://babeljs.io/): A es6/es7 compiler.
* [Bower](http://bower.io/): a package manager for the web.
* [Gulp](http://gulpjs.com/): automate and enhance your workflow.
* [Webpack](http://webpack.github.io/): module bundler for the browser
* [Mocha](http://mochajs.org/): test framework.
* [Sinon](http://sinonjs.org/): test spies, stubs and mocks.
* [Eslint](http://eslint.org/): The pluggable linting utility for JavaScript and JSX.
* [Travis](https://travis-ci.org/): Test and deploy. [![Build Status](https://travis-ci.org/FredericHeem/react-node-starterkit.svg?branch=master)](https://travis-ci.org/FredericHeem/react-node-starterkit)
* [Semaphore](https://semaphoreci.com) : Continuous integration [![Build Status](https://semaphoreci.com/api/v1/projects/0ad9309c-4953-49ac-a200-025e77931371/420174/badge.svg)](https://semaphoreci.com/frederich/react-node-starterkit)
* [CodeClimate](https://codeclimate.com): Automated code review [![Code Climate](https://codeclimate.com/github/FredericHeem/react-node-starterkit/badges/gpa.svg)](https://codeclimate.com/github/FredericHeem/react-node-starterkit)
[![Test Coverage](https://codeclimate.com/github/FredericHeem/react-node-starterkit/badges/coverage.svg)](https://codeclimate.com/github/FredericHeem/react-node-starterkit/coverage)
* [Coveralls](https://coveralls.io): [![Coverage Status](https://coveralls.io/repos/FredericHeem/react-node-starterkit/badge.svg?branch=master)](https://coveralls.io/r/FredericHeem/react-node-starterkit?branch=master)

# Workflow

To install all the dependencies:

    # npm install

## Backend

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

Now open a browser at `http://localhost:8080`

# License

See [LICENSE](LICENSE)

# Author

Crafted with passion by [Frederic Heem](https://github.com/FredericHeem)
