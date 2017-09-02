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

/* global process */
console.log("process.env.NODE_ENV ", process.env.NODE_ENV)
export default Object.assign({}, config.general, config[process.env.NODE_ENV]);
