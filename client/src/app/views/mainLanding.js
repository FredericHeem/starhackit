import React from 'react';
import DocMeta from 'react-doc-meta';
import DocTitle from 'components/docTitle';
import config from 'config';

import Debug from 'debug';
let debug = new Debug("views:main");

export default React.createClass({

    componentDidMount() {
        debug("componentDidMount");
    },

    render() {
        debug("render");


        return (
            <div id="main-landing">
                <DocTitle
                    title="Home"
                />
                <DocMeta tags={ this.tags() } />
                <div className="header-container">
                    <div className="header clearfix">
                        <div className="text-vertical-center">
                            <h1>StarHackIt</h1>
                            <h2>A Full Stack Web Application Starter Kit </h2>
                            <h3>Built with React, Node, data backed by SQL</h3>
                            <br />
                            <a className="btn btn-primary btn-lg" href="https://github.com/FredericHeem/starhackit" target="_blank">
                                <i className="fa fa-github"/> Clone the code on GitHub </a>
                        </div>
                    </div>
                </div>

                <section id="start">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h3>
                            <strong>Features</strong>
                        </h3>
                      </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <i className="fa fa-stack-exchange fa-stack-1x"></i>
                                </span>
                                <h4>
                                    <strong>Full stack</strong>
                                </h4>
                                <p>A complete frontend, backend and deployment solution to bootstrap your application</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <i className="fa fa-user fa-stack-1x"></i>
                                </span>
                                <h4>
                                    <strong>Authentication</strong>
                                </h4>
                                <p>Account registration with username and password, or with identity provider such as Google, Facebook, Twitter, GitHub etc ..</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <i className="fa fa-shield fa-stack-1x"></i>
                                </span>
                                <h4>
                                    <strong>Authorization</strong>
                                </h4>
                                <p>A group and permissions based authorization</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <i className="fa fa-database fa-stack-1x"></i>
                                </span>
                                <h4>
                                    <strong>Relational SQL Database</strong>
                                </h4>
                                <p>The data are modeled with sequelize, an ORM which support PostgreSQL, MySQL, MariaDB, SQLite and MSSQL</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="tech-stack-frontend">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h3>
                            <strong>Frontend - User Interface</strong>
                        </h3>
                      </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/react.svg" alt='REACT' width="64"/>
                                </span>
                                <h4>
                                    <a href="https://facebook.github.io/react/"><strong>React.js</strong></a>
                                </h4>
                                <p>A fast rising javascript library for building user interface.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <i className="fa fa-retweet fa-stack-1x"></i>
                                </span>
                                <h4>
                                    <a href="https://github.com/reflux/refluxjs"><strong>Reflux</strong></a>
                                </h4>
                                <p>A simple library for uni-directional dataflow application architecture with React extensions inspired by Flux</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/bootstrap.png" alt='Bootstrap' width="64"/>
                                </span>
                                <h4>
                                    <a href="http://getbootstrap.com/"><strong>Bootstrap</strong></a>
                                </h4>
                                <p>Bootstrap is the most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="tech-stack-backend">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h3>
                            <strong>Backend - API Server</strong>
                        </h3>
                      </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">

                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/nodejs.png" alt='Node.js' height="64"/>
                                </span>
                                <h4>
                                    <a href="https://nodejs.org"><strong>Node.js</strong></a>
                                </h4>
                                <p>A scalable javascript application server.</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/sequelize.png" alt='Sequelize' height="64"/>
                                </span>
                                <h4>
                                    <a href="http://docs.sequelizejs.com/en/latest/"><strong>Sequelize</strong></a>
                                </h4>
                                <p>Sequelize is a promise-based ORM for Node.js and io.js. It supports the dialects PostgreSQL, MySQL, MariaDB, SQLite and MSSQL</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/rabbitmq.png" alt='RabbitMq' height="32"/>
                                </span>
                                <h4>
                                    <a href="https://www.rabbitmq.com/"><strong>RabbitMq</strong></a>
                                </h4>
                                <p>Robust messaging for applications</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/passportjs.png" alt='Passportjs' width="64"/>
                                </span>
                                <h4>
                                    <a href="http://passportjs.org/"><strong>Passport</strong></a>
                                </h4>
                                <p>Simple, unobtrusive authentication for Node.js,
                                   supports more than 300 authentication stragegies such as username and password, Facebook, google etc ...</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="tech-stack-tools">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h3>
                            <strong>Developer Tools</strong>
                        </h3>
                      </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 col-sm-6">

                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/es7.png" alt='ES6/ES7' width="64"/>
                                </span>
                                <h4>
                                    <a href="https://github.com/lukehoban/es6features"><strong>ES6/ES7 ready</strong></a>
                                </h4>
                                <p>The new javascript ECMAScript 7</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/gulp.png" alt='Gulp' width="64"/>
                                </span>
                                <h4>
                                    <a href="http://gulpjs.com/"><strong>Gulp</strong></a>
                                </h4>
                                <p>A very popular build system for frontend and backend development</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/eslint.svg" alt='eslint' width="64"/>
                                </span>
                                <h4>
                                    <a href="http://eslint.org/"><strong>ESLint</strong></a>
                                </h4>
                                <p>The pluggable linting utility for JavaScript and JSX, find errors and coding style violation.</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/mocha.svg" alt='Mocha' width="64"/>
                                </span>
                                <h4>
                                    <a href="https://mochajs.org/"><strong>Mocha</strong></a>
                                </h4>
                                <p>A rich asynchronous test framework</p>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/webpack.png" alt='Webpack' width="64"/>
                                </span>
                                <h4>
                                    <a href="http://webpack.github.io/docs/"><strong>Webpack</strong></a>
                                </h4>
                                <p>A bundler for javascript and friends. Packs many modules into a few bundled assets.</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/nodemon.svg" alt='Nodemon' width="64"/>
                                </span>
                                <h4>
                                    <a href="http://nodemon.io/"><strong>Nodemon</strong></a>
                                </h4>
                                <p>Monitors for any changes in your node.js application and automatically restart the server</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/travis.png" alt='Travis CI' width="64"/>
                                </span>
                                <h4>
                                    <a href="https://travis-ci.org/"><strong>Travis CI</strong></a>
                                </h4>
                                <p>A continuous integration platform.</p>

                                <p><a href="https://travis-ci.org/FredericHeem/starhackit"><img src="https://travis-ci.org/FredericHeem/starhackit.svg?branch=master"/></a></p>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/codeclimate.png" alt='CodeClimate' width="64"/>
                                </span>
                                <h4>
                                    <a href="https://codeclimate.com/"><strong>CodeClimate</strong></a>
                                </h4>
                                <p>Code Coverage and Code Review</p>
                                <p><a href="https://codeclimate.com/github/FredericHeem/starhackit"><img src="https://codeclimate.com/github/FredericHeem/starhackit/badges/gpa.svg" /></a></p>
                                <p><a href="https://codeclimate.com/github/FredericHeem/starhackit/coverage"><img alt="Test Coverage" src="https://codeclimate.com/github/FredericHeem/starhackit/badges/coverage.svg"/></a></p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="tech-stack-tools">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h3>
                            <strong>Deployment Tools</strong>
                        </h3>
                      </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/ansible.png" alt='ansible' width="64"/>
                                </span>
                                <h4>
                                    <a href="http://www.ansible.com/"><strong>Ansible</strong></a>
                                </h4>
                                <p>Deploy apps. Manage systems</p>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/vagrant.png" alt='vagrant' width="64"/>
                                </span>
                                <h4>
                                    <a href="https://www.vagrantup.com/"><strong>Vagrant</strong></a>
                                </h4>
                                <p>Create and configure lightweight, reproducible, and portable development environments.</p>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="assets/img/docker.png" alt='docker' width="64"/>
                                </span>
                                <h4>
                                    <a href="https://www.docker.com/"><strong>Docker</strong></a>
                                </h4>
                                <p>An open platform for distributed applications for developers and sysadmins</p>
                            </div>
                        </div>
                    </div>

                </section>

                <section id="info">
                    <div className="jumbotron">
                        <p className="lead text-center">
                            All <a href="https://github.com/FredericHeem/starhackit" target="_blank">
                            source code </a> is released
                            under an open source license at <i className="fa fa-github"/>
                        </p>
                    </div>
                </section>
            </div>
        );
    },

    scrollTo( ref ) {
        return () => {
            $( 'html,body' ).animate( {
                scrollTop: $( ref ).offset().top
            }, 1000 );
        };
    },

    tags() {
        let description = config.description;

        return [
            {name: 'description', content: description},
            {name: 'twitter:card', content: description},
            {name: 'twitter:title', content: description},
            {property: 'og:title', content: description}
        ];
    }


} );
