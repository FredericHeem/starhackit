import React from 'react';
import DocMeta from 'react-doc-meta';
import DocTitle from 'components/docTitle';
import Debug from 'debug';
let debug = new Debug("views:registrationComplete");

//import { Link } from 'react-router';
//import background from 'assets/img/landing-background.jpg';

export default React.createClass({

    componentDidMount() {
        debug("componentDidMount");
    },

    render() {
        debug("render");
        let style = {
            //background: `url(${background}) no-repeat center center scroll`
        };

        return (
            <div id="main-landing">
                <DocTitle
                    title="Home"
                />
                <DocMeta tags={ this.tags() } />
                <div className="header-container">
                    <div className="header clearfix" style={style}>
                        <div className="text-vertical-center">
                            <h1>StarterKit</h1>
                            <h2>A Full Stack Web Application Starter Kit </h2>
                            <h3>Built with React, Node, data backed by SQL</h3>
                            <br />
                            <button className="btn btn-primary btn-lg" onClick={ this.scrollTo( '#start' ) }>Find Out More</button>
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
                                <p>A complete frontend and backend solution to bootstrap your application</p>
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
                                <p>Account registration with username and password, or with identity provider such as google, facebook, tweeter, github etc ..</p>
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
                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">

                                <span className="fa-stack fa-4x">
                                    <img src="https://facebook.github.io/react/img/logo.svg" alt='REACT' width="64"/>
                                </span>
                                <h4>
                                    <a href="https://facebook.github.io/react/"><strong>React.js</strong></a>
                                </h4>
                                <p>A fast rising javascript library for building user interface.</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
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

                        <div className="col-md-3 col-sm-6">
                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="http://brunch.io/images/others/gulp.png" alt='REACT' width="64"/>
                                </span>
                                <h4>
                                    <a href="http://gulpjs.com/"><strong>Gulp</strong></a>
                                </h4>
                                <p>A very popular build system for frontend development</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">

                            <div className="start-item">
                                <span className="fa-stack fa-4x">
                                    <img src="https://angularclass.com/images/es6.png" alt='REACT' width="64"/>
                                </span>
                                <h4>
                                    <a href="https://github.com/lukehoban/es6features"><strong>ES6 ready</strong></a>
                                </h4>
                                <p>The new javascript ECMAScript 6</p>
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
                                    <img src="https://nodejs.org/static/images/logos/nodejs.png" alt='REACT' height="64"/>
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
                                    <img src="http://docs.sequelizejs.com/en/latest/images/logo-small.png" alt='Sequelize' height="64"/>
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
                                    <img src="https://www.rabbitmq.com/img/rabbitmq_logo_strap.png" alt='RabbitMq' height="32"/>
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
                                    <img src="http://the-phpjs-ldc.rgou.net/nodejs-modules/passport/assets/images/logo-90px.png" alt='REACT' width="64"/>
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
                            <strong>Developper Tools</strong>
                        </h3>
                      </div>
                    </div>
                    <div className="row">

                        <div className="col-md-3 col-sm-6">
                            <h4>Static analysis</h4>
                            <p> <a href="http://eslint.org/" target="_blank">ESLint</a>: the pluggable linting utility for JavaScript and JSX, find errors and coding style violation.</p>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <h4>Testing</h4>
                            <p><a href="https://mochajs.org/" target="_blank">Mocha</a>: a rich test framework.</p>

                            <p><a href="https://travis-ci.org/" target="_blank">Travis: </a>
                                <a href="https://travis-ci.org/FredericHeem/react-node-starterkit"><img src="https://travis-ci.org/FredericHeem/react-node-starterkit.svg?branch=master"/></a>
                            </p>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <h4>Code coverage</h4>
                            <p><a href="https://gotwarlost.github.io/istanbul/" target="_blank">Istanbul</a>: a code coverage tool that computes statement, line, function and branch coverage. </p>
                            <p><a href="https://coveralls.io">Coveralls</a>: <a href="https://codeclimate.com/github/FredericHeem/react-node-starterkit/coverage"><img alt="Test Coverage" src="https://codeclimate.com/github/FredericHeem/react-node-starterkit/badges/coverage.svg"/></a></p>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <h4>Hot code reloading</h4>
                            <p>On the frontend side, <a href="https://webpack.github.io/docs/webpack-dev-server.html">webpack dev server</a>, the browser is automatically reload when code is changed.</p>
                            <p>On the backend side, <a href="https://github.com/remy/nodemon">nodemon</a> monitors for any changes in your node.js application and automatically restart the server </p>
                        </div>
                    </div>
                </section>

                <section id="info">
                    <div className="jumbotron">
                        <p className="lead">
                            All <a href="https://github.com/FredericHeem/react-node-starterkit" target="_blank">
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
        let description = 'StartKit is a full stack application boilerplate';

        return [
            {name: 'description', content: description},
            {name: 'twitter:card', content: description},
            {name: 'twitter:title', content: description},
            {property: 'og:title', content: description}
        ];
    }


} );
