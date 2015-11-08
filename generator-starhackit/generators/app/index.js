'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');
var parseAuthor = require('parse-author');
var askName = require('inquirer-npm-name');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

  },
  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage
    };

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

      this.option('name', {
         type: String,
         required: false,
         desc: 'Project name'
       });

      var prompts = [{
        type: 'confirm',
        name: 'someOption',
        message: 'Would you like to enable this option?',
        default: true
      }];

      this.prompt(prompts, function (props) {
        this.props = props;
        // To access props later use this.props.someOption;

        done();
      }.bind(this));
    }
  },

  writing: {
    app: function () {
      //console.log("destinationPath: ", this.destinationPath());
      this.sourceRoot(path.join(__dirname, '../../../'));
      //console.log("sourceRoot: ", this.sourceRoot());
      this.directory('server');
      this.directory('client');
      this.directory('deploy');
      this.fs.copy(
        this.templatePath('.travis.yml'),
        this.destinationPath('.travis.yml')
      );
      this.sourceRoot(path.join(__dirname, 'template'));
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
    },

    projectfiles: function () {

    }
  },

  install: function () {
    this.installDependencies({bower: false});
  }
});
