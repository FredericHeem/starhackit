const config = {
  general: {
    title: "StarHackIt",
    description: "React Mobx Emotion Node Starter Kit",
    apiUrl: "/api/v1/",
    socialAuth: ["facebook", "google"],
    debug: {
      log: false,
      i18n: false,
    },
  },

  development: {
    env: "development",
    disableUsernamePasswordAuth: false,

    debug: {
      log: true,
      i18n: false,
    },
  },

  production: {
    env: "production",
    disableUsernamePasswordAuth: true,
  },
};

/* global process */
console.log("process.env.NODE_ENV ", process.env.NODE_ENV);
export default Object.assign({}, config.general, config[process.env.NODE_ENV]);
