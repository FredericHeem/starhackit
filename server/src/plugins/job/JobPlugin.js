export default app => {
  app.data.registerModel(__dirname, `JobModel`);
  app.data.registerModel(__dirname, `ProfileCandidateModel`);

  require("./RecruiterApi")(app);
  require("./CandidateApi")(app);
  require("./CandidateProfileApi")(app);
};
