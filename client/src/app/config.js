import _ from 'lodash';

/* global process */
const env = process.env;

const config = {

    general: {
        title: 'StarHackIt',
        description: 'React Mobx Glamorous Node Starter Kit',
        apiUrl: '/api/v1/',
        analytics: {
            google: ""
        },
        socialAuth: ["facebook"],
        debug: {
          log: false,
          i18n: false
        }
    },

    development: {
        env: "development",
        debug: {
          log: true,
          i18n: false
        }
    },

    production: {
        env: "production"

    }
};

export default _.extend({}, config.general, config[env.NODE_ENV]);
