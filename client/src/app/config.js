import _ from 'lodash';

let env = process.env;

let config = {

    general: {
        title: 'StarHackIt'
    },

    development: {
        homeUrl: 'http://localhost:8080/',
        baseUrl: 'http://localhost:8080/api/v1/'
    },

    production: {
        homeUrl: 'https://starhack.it/',
        baseUrl: 'https://starhack.it/api/v1/'
    }
};

export default _.extend( {}, config.general, config[ env.NODE_ENV ] );
