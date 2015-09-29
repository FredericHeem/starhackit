import _ from 'lodash';

let env = process.env;

let config = {

    general: {},

    development: {
        homeUrl: 'http://dev.myfabulousapp.com/',
        baseUrl: 'http://localhost:8080/api/v1/'
    },

    production: {
        homeUrl: 'http://myfabulousapp.com/',
        baseUrl: 'http://myfabulousapp/api/v1/'
    }
};

export default _.extend( {}, config.general, config[ env.NODE_ENV ] );
