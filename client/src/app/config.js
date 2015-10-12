import _ from 'lodash';

let env = process.env;

let config = {

    general: {
        title: 'StarterKit'
    },

    development: {
        homeUrl: 'http://dev.myfabulousapp.com/',
        baseUrl: 'http://localhost:8080/api/v1/'
    },

    production: {
        homeUrl: 'https://react-node-starterkit.herokuapp.com/',
        baseUrl: 'https://react-node-starterkit.herokuapp.com/api/v1/'
    }
};

export default _.extend( {}, config.general, config[ env.NODE_ENV ] );
