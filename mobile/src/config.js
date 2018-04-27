const config = {
  general: {
    title: "StarHackIt",
    subTitle: "React Native Starter Kit"
  },

  development: {
    env: "development",
    apiUrl: "http://192.168.0.9:9000/api/v1/"
  },

  production: {
    env: "production",
    apiUrl: "https://starhack.it/api/v1/"
  }
};

/* global process */
console.log("process.env.NODE_ENV ", process.env.NODE_ENV);
export default Object.assign({}, config.general, config[process.env.NODE_ENV]);
