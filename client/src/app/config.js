import _ from 'lodash';

let env = process.env;

let config = {

    general: {
        title: 'StarHackIt',
        description: 'StarHackIt is a fullstack boilerplate written in es6/es7'
    },

    development: {
        homeUrl: 'http://localhost:8080/',
        baseUrl: 'http://localhost:8080/api/v1/'
    },

    production: {
        homeUrl: 'http://starhack.it/',
        baseUrl: 'http://starhack.it/api/v1/'
    }
};

export default _.extend( {}, config.general, config[ env.NODE_ENV ] );
