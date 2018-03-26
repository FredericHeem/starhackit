export default app => {
  ["JobModel", "ProfileCandidateModel", "JobApplicationModel"].forEach(model =>
    app.data.registerModel(__dirname, `./${model}`)
  );

  ["RecruiterApi", "CandidateApi", "CandidateProfileApi", "CandidateApplicationApi"].forEach(model =>
    require(`./${model}`)(app)
  );
};
