# Multi Application

Most of the time, they are multiple frontends for one application: the user facing frontend and the admin frontend. Having separate git repositories for these app causes a lot of maintenance and code sharing problems.

There are 4 frontend applications in this repository:

* [app\_user](https://github.com/FredericHeem/starhackit/tree/master/client/src/app_user)
* [app\_admin](https://github.com/FredericHeem/starhackit/tree/master/client/src/app_admin)
* [app\_public](https://github.com/FredericHeem/starhackit/tree/master/client/src/app_public)
* [app\_micro](https://github.com/FredericHeem/starhackit/tree/master/client/src/app_micro)

To start a browser to the relevant app, one could add the _open-page_ option:

```text
$ npm start -- --open-page=user 
```

Webpack will open a browser at [http://0.0.0.0:8080/user](http://0.0.0.0:8080/user)

