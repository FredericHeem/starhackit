# Introduction

![Starhack](.gitbook/assets/starhackit-logo-text.png)

## StarHackIt

StarHackIt is a fullstack starter kit composed of:

* [React web frontend](frontend/client.md)
* [Node backend](backend/server.md)
* [React native mobile app ](https://github.com/FredericHeem/starhackit/tree/09437da314079802151aa899cffca97ea342f146/mobile/README.md)
* [Deployment by Ansible with docker images](https://github.com/FredericHeem/starhackit/tree/09437da314079802151aa899cffca97ea342f146/deploy/playbook/README.md)

Fullstack web application starter kit written in modern Javascript with react and node.js with the following features:

* Authentication: username/password, facebook, google authentication etc ...
* Authorization: scheme using user, group and permission  
* Scalable by using a micro services based architecture, a.k.a message queues
* Relational database: postgres, mysql, sqlite, mssql etc, ...
* Logging
* 100% results in [Lighthouse test](https://developers.google.com/web/tools/lighthouse/)

### Dev Technologies

* [Docker](https://www.docker.com/): Debug your app, not your environment
* [Mocha](http://mochajs.org/): test framework.
* [Karma](https://karma-runner.github.io): a productive testing environment to developers
* [Nightwatch](http://nightwatchjs.org/): End-to-End tests in Node.js quickly and effortlessly that run against a Selenium server
* [Sinon](http://sinonjs.org/): test spies, stubs and mocks.
* [Eslint](http://eslint.org/): The pluggable linting utility for JavaScript and JSX.
* [Travis](https://travis-ci.org/): Test and deploy. [![Build Status](https://travis-ci.org/FredericHeem/starhackit.svg?branch=master)](https://travis-ci.org/FredericHeem/starhackit)
* [NYC](https://github.com/istanbuljs/nyc): Code coverage
* [![Greenkeeper badge](https://badges.greenkeeper.io/FredericHeem/starhackit.svg)](https://greenkeeper.io/)

> The frontend and the backend are two separate projects with their own set of dependencies. One can use the frontend with another existing backend, or use the backend with another frontend stack.

### Clone the source code

To get the latest code, grab it by cloning the repository from GitHub:

```text
$ git clone https://github.com/FredericHeem/starhackit.git yourproject
$ cd yourproject
```

## License

See [LICENSE](https://github.com/FredericHeem/starhackit/tree/09437da314079802151aa899cffca97ea342f146/LICENSE/README.md)

## Author

Crafted with passion by [Frederic Heem](https://github.com/FredericHeem)

