import React from 'react';
import DocMeta from 'react-doc-meta';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import DocTitle from 'components/docTitle';
import config from 'config';
//import tr from 'i18next';
import Debug from 'debug';
let debug = new Debug("views:main");

import Card from 'material-ui/lib/card/card';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

let CardIcon = React.createClass({
    renderIcon(props){
        return (
            <CardMedia>
                <FontIcon
                    className={props.icon}
                    style={{
                        fontSize:'64'
                    }}/>
            </CardMedia>
        );
    },
    renderImg(props){
        return (
            <div>
                <img src={props.img} alt={props.title} height={props.height} width={props.width}/>
            </div>
        );
    },
    render(){
        let {props} = this;
        return (
                <Card
                    className='flex-items'
                    style={{
                    }}>
                  <CardTitle
                    title={props.title}
                  />
                  <CardText>
                    {props.text}
                  </CardText>
                  {props.icon && this.renderIcon(props)}
                  {props.img && this.renderImg(props)}
                </Card>
        );
    }
});

export default React.createClass({

    componentDidMount() {
        debug("componentDidMount");
    },

    render() {
        debug("render ");

        return (
            <div id="main-landing" className='text-center'>
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

                            <RaisedButton
                                      label="Clone the code on GitHub"
                                      linkButton={true}
                                      href="https://github.com/FredericHeem/starhackit"
                                      icon={<FontIcon className="icon-github-circled-alt2"/>}
                                   />
                        </div>
                    </div>
                </div>

                <section id="start">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h2>
                            <strong>Features</strong>
                        </h2>
                      </div>
                    </div>
                    <div className="row text-center">
                        <CardIcon
                            icon='icon-stackexchange'
                            title='Full Stack'
                            text='A complete frontend, backend and deployment solution to bootstrap your application'/>
                        <CardIcon
                            icon='icon-user'
                            title='Authentication'
                            text='Account registration with username and password, or with identity provider such as Google, Facebook, Twitter, GitHub etc ..'/>

                        <CardIcon
                            icon='icon-shield'
                            title='Authorization'
                            text='A group and permissions based authorization'/>

                        <CardIcon
                            icon='icon-database'
                            title='Relational SQL Database'
                            text='The data are modeled with sequelize, an ORM which support PostgreSQL, MySQL, MariaDB, SQLite and MSSQL'/>
                    </div>
                </section>

                <section id="tech-stack-frontend">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h2>
                            <strong>Frontend - User Interface</strong>
                        </h2>
                      </div>
                    </div>
                    <div className="row">
                        <CardIcon
                            img='assets/img/react.svg'
                            height='200'
                            title='React'
                            link='https://facebook.github.io/react/'
                            text='A fast rising javascript library for building user interface.'/>

                        <CardIcon
                            img='assets/img/material-ui.svg'
                            title='Material-UI'
                            height='200'
                            link='http://www.material-ui.com'
                            text="A Set of React Components that Implement Google's Material Design"/>

                        <CardIcon
                            icon='icon-retweet'
                            title='Reflux'
                            link='https://github.com/reflux/refluxjs'
                            text='A simple library for uni-directional dataflow application architecture with React extensions inspired by Flux'/>
                    </div>
                </section>
                <section id="tech-stack-backend">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h2>
                            <strong>Backend - API Server</strong>
                        </h2>
                      </div>
                    </div>
                    <div className="row">
                        <CardIcon
                            img='assets/img/nodejs.png'
                            title='Node.js'
                            height="120"
                            link='https://nodejs.org'
                            text='A scalable javascript application server.'/>

                        <CardIcon
                            img='assets/img/sequelize.png'
                            height='120'
                            title='Sequelize'
                            link='http://docs.sequelizejs.com/en/latest/'
                            text='Sequelize is a promise-based ORM for Node.js and io.js. It supports the dialects PostgreSQL, MySQL, MariaDB, SQLite and MSSQL'/>

                        <CardIcon
                            img='assets/img/rabbitmq.png'
                            title='RabbitMq'
                            width='200'
                            link='assets/img/rabbitmq.png'
                            text='Robust messaging for applications'/>

                        <CardIcon
                            img='assets/img/passportjs.png'
                            title='Passportjs'
                            width='64'
                            link='http://passportjs.org/'
                            text='Simple, unobtrusive authentication for Node.js,
                               supports more than 300 authentication stragegies such as username and password, Facebook, google etc ...'/>

                    </div>
                </section>
                <section id="tech-stack-tools">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h2>
                            <strong>Developer Tools</strong>
                        </h2>
                      </div>
                    </div>
                    <div className="row">
                        <CardIcon
                            img='assets/img/es7.png'
                            title='ES6/ES7 ready'
                            height='220'
                            link='https://github.com/lukehoban/es6features'
                            text='The new javascript ECMAScript 7'/>

                        <CardIcon
                            img='assets/img/gulp.png'
                            title='Gulp'
                            height='200'
                            link='http://gulpjs.com/'
                            text='A very popular build system for frontend and backend development'/>

                        <CardIcon
                            img='assets/img/eslint.svg'
                            title='ESLint'
                            height='180'
                            link='http://eslint.org/'
                            text='The pluggable linting utility for JavaScript and JSX, find errors and coding style violation.'/>

                        <CardIcon
                            img='assets/img/mocha.svg'
                            title='Mocha'
                            height='230'
                            link='https://mochajs.org/'
                            text='A rich asynchronous test framework'/>

                    </div>
                    <div className="row">
                        <CardIcon
                            img='assets/img/webpack.png'
                            title='Webpack'
                            height='160'
                            link='http://webpack.github.io/docs/'
                            text='A bundler for javascript and friends. Packs many modules into a few bundled assets.'/>

                        <CardIcon
                            img='assets/img/nodemon.svg'
                            title='Nodemon'
                            height='160'
                            link='http://nodemon.io/'
                            text='Monitors for any changes in your node.js application and automatically restart the server'/>

                        <CardIcon
                            img='assets/img/travis.png'
                            title='Travis CI'
                            link='https://travis-ci.org/'
                            text='A continuous integration platform.'/>

                        <CardIcon
                            img='assets/img/codeclimate.png'
                            title='CodeClimate'
                            height='200'
                            link='https://codeclimate.com/'
                            text='Code Coverage and Code Review'/>

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
                        <CardIcon
                            img='assets/img/ansible.png'
                            title='Ansible'
                            width='64'
                            link='http://www.ansible.com/'
                            text='Deploy apps. Manage systems'/>

                        <CardIcon
                            img='assets/img/vagrant.png'
                            title='Vagrant'
                            link='https://www.vagrantup.com/'
                            text='Create and configure lightweight, reproducible, and portable development environments.'/>

                        <CardIcon
                            img='assets/img/docker.png'
                            title='Docker'
                            link='https://www.docker.com/'
                            text='An open platform for distributed applications for developers and sysadmins'/>

                    </div>

                </section>
            </div>
        );
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
