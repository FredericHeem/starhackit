# Multi Application

Most of the time, they are multiple frontends for one application: the user facing frontend and the admin frontend.
Having separate git repositories for these app causes a lot of maintenance and code sharing problems.

There are 4 frontend applications in this repository:
* [app_user](https://github.com/FredericHeem/starhackit/tree/master/client/src/app_user)
* [app_admin](https://github.com/FredericHeem/starhackit/tree/master/client/src/app_admin)
* [app_public](https://github.com/FredericHeem/starhackit/tree/master/client/src/app_public)
* [app_micro](https://github.com/FredericHeem/starhackit/tree/master/client/src/app_micro)

To start a browser to the relevant app, one could add the *open-page* option:

    $ npm start -- --open-page=user 

Webpack will open a browser at *http://0.0.0.0:8080/user*