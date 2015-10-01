import Log from 'logfilename';

export default function MeApi (app){
  let models = app.data.sequelize.models;
  let log = new Log(__filename);
  return {
    index: function(){
      log.error("index ");

    },
    update: function () {
      log.debug("update ");

      //return models.User.findByUserId(userId);
    }
  };
}
