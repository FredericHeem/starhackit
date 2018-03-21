export default app => {
  const { models } = app.data.sequelize;

  const api = {
    pathname: "/candidate/profile",
    ops: {
      get: {
        pathname: "/",
        method: "get",
        handler: async context => {
          const [profile] = await models.ProfileCandidate.findOrCreate({
            where: { user_id: context.state.user.id }
          });
          context.body = profile.get();
          context.status = 200;
        }
      },
      patch: {
        pathname: "/",
        method: "patch",
        handler: async context => {
          //console.log("patch candidate profile: ", context.request.body);
          await models.ProfileCandidate.update(context.request.body, {
            where: {
              user_id: context.state.user.id
            }
          });
          const profile = await models.ProfileCandidate.findOne({
            where: { user_id: context.state.user.id }
          });
          //console.log("patch candidate profile: ", profile.get());
          context.body = profile.get();
          context.status = 200;
        }
      }
    }
  };

  app.server.createRouter(api);
};
