import _ from 'lodash';

/* global process */
let env = process.env;

let config = {

    general: {
        title: 'StarHackIt',
        description: 'React Redux Node StarterKit',
        apiUrl: '/api/v1/',
        analytics: {
            google: ""
        },
        socialAuth: {
            facebook: true,
            fidor: false
        }
    },

    development: {
        env: "development"
    },

    production: {
        env: "production"

    }
};

export default _.extend( {}, config.general, config[ env.NODE_ENV ] );
