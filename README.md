React Node starterkit
==================

Fullstack web application starter kit written in react and node.js with the following features:

* Authentication: register, login  
* Authorization: scheme using user, group and permission  
* Scalable by using a micro services based architecture, a.k.a message queues
* Relational database: postgres, mysql, sqlite, mssql etc, ...
* Logging

Technologies:

* [React](https://facebook.github.io/react/): a facebook library to build user interfaces.
* [Material ui](http://callemall.github.io/material-ui/#/): a CSS framework and a set of react components that implement google's material design.
* [Express](http://expressjs.com/): fast, unopinionated, minimalist web framework for Node.js.
* [Socket.io](http://socket.io/): real-time bidirectional event-based communication.
* [Sequelize](http://docs.sequelizejs.com/en/latest/): Object Relationship Management (ORM) supporting majors relational SQL database.
* [PostgreSQL](http://www.postgresql.org/): the world's most advanced open source  
* [RabbitMq](https://www.rabbitmq.com/): messaging system.
* [Passport](http://passportjs.org/): authentication framework with more than 140 authentication strategies: username/password, facebook , google, github etc ...
* [Winston](https://github.com/winstonjs/winston): a multi-transport async logging library.
* [Bower](http://bower.io/): a package manager for the web.
* [Gulp](http://gulpjs.com/): automate and enhance your workflow.
* [Grunt](http://gruntjs.com/): the javascript task runner.
* [Mocha](http://mochajs.org/): test framework.
* [Sinon](http://sinonjs.org/): test spies, stubs and mocks.
* [Travis](https://travis-ci.org/): Test and deploy.
* [CodeClimate](https://codeclimate.com): Automated code review [![Code Climate](https://codeclimate.com/github/FredericHeem/react-node-starterkit/badges/gpa.svg)](https://codeclimate.com/github/FredericHeem/react-node-starterkit) [![Code Climate]
[![Test Coverage](https://codeclimate.com/github/FredericHeem/react-node-starterkit/badges/coverage.svg)](https://codeclimate.com/github/FredericHeem/react-node-starterkit/coverage)

#Workflow


To install all the dependencies:

    # npm install


To test the backend:

    # npm test 

It will not only test the code, but also check the source code with jshint and generate a code coverage report located at `coverage/lcov-report/index.html`


To run the webserver:

    # npm start
