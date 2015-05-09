var config = require('config');
var util = require('util');
var db = config.get('db');
var databaseUrl = util.format("postgres://%s:%s@%s:%s/%s",db.user, db.password, db.host, db.port, db.database);

module.exports = function (grunt) {

  grunt.initConfig({
    migrate: {
      options: {
        'migrations-dir': './lib/data/migrations',
        verbose: true,
        env: {
          DATABASE_URL: databaseUrl
        }
      }
    },

    jsdoc : {
      dist : {
        src: ['./index.js', './lib/api/*.js'],
        options: {
          destination: './doc/jsdoc'
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    jshint: {
      files: [
        '!Gruntfile.js',
        'index.js',
        'package.json',
        'config/*',
        'lib/**/*.js',
        '!lib/data/migrations/*.js',
        'processes/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  
  grunt.registerTask('test', ['jshint', 'mochaTest:test']);

  grunt.registerTask('default', ['migrate']);
};
