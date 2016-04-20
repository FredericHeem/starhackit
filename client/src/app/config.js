import _ from 'lodash';

/* global process */
let env = process.env;

let config = {

    general: {
        title: 'IDio',
        description: 'IDio store and share your identities',
        apiUrl: '/api/v1/',
        analytics: {
            google: ""
        },
        socialAuth: {
            facebook: true,
            fidor: true
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
