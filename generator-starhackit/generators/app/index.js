'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');
var parseAuthor = require('parse-author');
var askName = require('inquirer-npm-name');
var extend = require('deep-extend');
var githubUsername = require('github-username');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

  },
  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Pre set the default props from the information we have at this point
    this.props = {};

    if (_.isObject(this.pkg.author)) {
      this.props.authorName = this.pkg.author.name;
      this.props.authorEmail = this.pkg.author.email;
      this.props.authorUrl = this.pkg.author.url;
    } else if (_.isString(this.pkg.author)) {
      var info = parseAuthor(this.pkg.author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }
  },
  prompting: {
    say: function () {
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the sweet ' + chalk.red('Starthackit') + ' generator!'
      ));
    },

    askForModuleName: function () {
      if (this.options.name) {
        this.props.name = _.kebabCase(this.options.name);
        return;
      }
      var done = this.async();
      this.props = {};
      askName({
        name: 'name',
        message: 'Project Name',
        default: path.basename(process.cwd()),
        filter: _.kebabCase,
        validate: function (str) {
          return str.length > 0;
        }
      }, this, function (name) {
        this.props.name = name;
        done();
      }.bind(this));
    },

    askFor: function () {
     var done = this.async();

     var prompts = [{
       name: 'description',
       message: 'Description',
     }, {
       name: 'homepage',
       message: 'Project homepage url',
     }, {
       name: 'authorName',
       message: 'Author\'s Name',
       default: this.user.git.name(),
       store: true
     }, {
       name: 'authorEmail',
       message: 'Author\'s Email',
       default: this.user.git.email(),
       store: true
     }, {
       name: 'authorUrl',
       message: 'Author\'s Homepage',
       store: true
     }, {
       name: 'keywords',
       message: 'Package keywords (comma to split)',
       filter: _.words
     }];

     this.prompt(prompts, function (props) {
       this.props = extend(this.props, props);
       done();
     }.bind(this));
   },
   askForGithubAccount: function () {
     var done = this.async();
     githubUsername(this.props.authorEmail, function (err, username) {
       this.prompt({
         name: 'githubAccount',
         message: 'GitHub username or organization',
         default: username
       }, function (prompt) {
         this.props.githubAccount = prompt.githubAccount;
         done();
       }.bind(this));
     }.bind(this));
   },
   askForRepoUrl: function () {
    var done = this.async();
    console.log("this.options.githubAccount ", this.props.githubAccount)
    var prompts = [{
      name: 'repoUrl',
      message: 'repository url',
      default: "git@github.com:" + this.props.githubAccount + '/' + this.props.name + ".git",
      store: true
    }];

    this.prompt(prompts, function (props) {
      this.props = extend(this.props, props);
      done();
    }.bind(this));
  }
},
  writing: {
    app: function () {
      this.sourceRoot(path.join(__dirname, 'template'));
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.sourceRoot(path.join(__dirname, '../../../'));
      this.directory('server');
      this.directory('client');
      this.directory('deploy');
      this.fs.copy(
        this.templatePath('.travis.yml'),
        this.destinationPath('.travis.yml')
      );

    },

    projectfiles: function () {
      var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
      console.log("name: ", this.props.name);
      var pkg = {
        name: _.kebabCase(this.props.name),
        version: '0.0.0',
        description: this.props.description,
        homepage: this.props.homepage,
        author: {
          name: this.props.authorName,
          email: this.props.authorEmail,
          url: this.props.authorUrl
        },
        keywords: this.props.keywords
      };
      currentPkg.repository.url = this.props.repoUrl;
      // Let's extend package.json so we're not overwriting user previous fields
      this.fs.writeJSON('package.json', extend(currentPkg, pkg));
    }
  },

  install: function () {
    this.installDependencies({bower: false});
  }
});
