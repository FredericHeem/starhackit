
# Setup Travis CI

## NODE_CONFIG

The configuration file for the api server running on [Travis CI](https://travis-ci.org) will be given through the environment variable **NODE_CONFIG**

* Create a new config file called _config/travis.json_ from the _config/default.json_
* Change this config with the relevant credentials regarding the mail, facebook configuration.
* Join all lines to make sure the config sticks on one line.

> With the Atom editor: Edit -> Lines -> Join Lines

* In the travis settings page, create a variable *NODE_CONFIG*
* Paste the one line config surrounded with **SINGLE QUOTE**

## CodeClimate

When the project is setup with [CodeClimate](https://codeclimate.com), a unique repository token will be created.
On the Travis project page, go to the settings and set the variable **CODECLIMATE_REPO_TOKEN** to this token

## Coveralls

Same apply for [Coveralls](https://coveralls.io), but the variable is called **COVERALLS_REPO_TOKEN**
