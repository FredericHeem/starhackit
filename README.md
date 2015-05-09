React Node starterkit
==================

Fullstack web application starter kit written in react and node.js with the following features:

* Authentication: register, login  
* Authorization: scheme using user, group and permission  
* Scalable by using a micro services based architecture, a.k.a message queues
* Relational database: postgres, mysql, sqlite, mssql etc, ...
* Logging

Technologies:

* [react](https://facebook.github.io/react/): a facebook library to build usr interfaces
* [material ui](http://callemall.github.io/material-ui/#/): a CSS framework and a set of react components that implement google's material design
* [express](http://expressjs.com/): fast, unopinionated, minimalist web framework for Node.js
* [socket.io](http://socket.io/): real-time bidirectional event-based communication.
* [sequelize](http://docs.sequelizejs.com/en/latest/) ORM supporting majors relational SQL database.
* [RabbitMq](https://www.rabbitmq.com/): messaging system.
* [passport](http://passportjs.org/): authentication framework with more than 140 authentication strategies: username/password, facebook , google, github etc ...
* [bower](http://bower.io/): a package manager for the web
* [gulp](http://gulpjs.com/): automate and enhance your workflow
* [grunt](http://gruntjs.com/): the javascript task runner
* [Mocha](http://mochajs.org/): test framework
* [sinon](http://sinonjs.org/): test spies, stubs and mocks.
* [travis](https://travis-ci.org/): Test and deploy


#Workflow


To install all the dependencies:

    # npm install


To test the backend:

    # npm test 

It will not only test the code, but also check the source code with jshint and generate a code coverage report located at `coverage/lcov-report/index.html`


To run the webserver:

    # npm start
