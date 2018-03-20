export default app => {
  app.data.registerModel(__dirname, `JobModel`);

  require("./RecruiterApi")(app);
  require("./CandidateApi")(app)  
};
