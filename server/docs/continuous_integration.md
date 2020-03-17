
# Setup Travis CI

## NODE_CONFIG

The configuration file for the api server running on [Travis CI](https://travis-ci.org) will be given through the environment variable **NODE_CONFIG**

* Create a new config file called _config/travis.json_ from the _config/default.json_
* Change this config with the relevant credentials regarding the mail, facebook configuration.
* Join all lines to make sure the config sticks on one line.

> With the Atom editor: Edit -> Lines -> Join Lines

* In the travis settings page, create a variable *NODE_CONFIG*
* Paste the one line config surrounded with **SINGLE QUOTE**
