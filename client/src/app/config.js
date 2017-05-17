import _ from 'lodash';

/* global process */
const env = process.env;

const config = {

    general: {
        title: 'StarHackIt',
        description: 'React Redux Node StarterKit',
        apiUrl: '/api/v1/',
        analytics: {
            google: ""
        },
        socialAuth: ["facebook", "crossbank"],
        debug: {
          log: false,
          redux: false,
          i18n: false
        }
    },

    development: {
        env: "development",
        debug: {
          log: true,
          redux: false,
          i18n: false
        }
    },

    production: {
        env: "production"

    }
};

export default _.extend({}, config.general, config[env.NODE_ENV]);
