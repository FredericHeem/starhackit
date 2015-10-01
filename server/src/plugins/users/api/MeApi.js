import Log from 'logfilename';
let log = new Log(__filename);

export default function MeApi (app){
  let models = app.data.sequelize.models;

  return {
    index: function(userId){
      log.debug("index userId: ", userId);
      return models.User.findByUserId(userId).then(user => {
        log.debug("index user: ", user.get());
        return user.get();
      });
    },
    update: function () {
      log.debug("update ");

      //return models.User.findByUserId(userId);
    }
  };
}
