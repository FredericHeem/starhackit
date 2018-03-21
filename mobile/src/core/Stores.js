export default context => {
  const stores = {
    auth: require("./authStore").default(context),
    facebook: require("./facebookStore").default(context),
    geoLoc: require("./geoLocStore").default(context)
  };

  return stores;
};
