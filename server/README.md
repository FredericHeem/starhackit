Node.js starterkit
==================

Backend Starter Kit written in node.js with the following features:

* REST API and Websocket
* Authentication 
* Authorization
* Scalable by using a micro services based architecture
* Relational and non relational database.
* Logging

Technologies:

* [express](http://expressjs.com/): fast, unopinionated, minimalist web framework for Node.js
* [socket.io](http://socket.io/): real-time bidirectional event-based communication.
* [sequelize](http://docs.sequelizejs.com/en/latest/) ORM supporting majors relational SQL database and NoSQL database.
* [RabbitMq](https://www.rabbitmq.com/): messaging system.
* [passport](http://passportjs.org/): authentication framework with more than 140 authentication strategies: username/password, facebook , google, github etc ...
* [Mocha](http://mochajs.org/): test framework
* [sinon](http://sinonjs.org/): test spies, stubs and mocks.


#Workflow


To install all the dependencies:

    # npm install


To test the backend:

    # npm test 

It will not only test the code, but also check the source code with jshint and generate a code coverage report located at `coverage/lcov-report/index.html`


To run the webserver:

    # node processes/server.js
