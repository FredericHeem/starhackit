import Log from 'logfilename';
import _ from 'lodash';
let log = new Log(__filename);

export default function MeApi (app){
  let models = app.data.sequelize.models;

  return {
    index: function(userId){
      log.debug("index userId: ", userId);
      return models.User.findByUserId(userId).then(user => {
        log.debug("index user: ", user.get());
        return _.omit(user.toJSON(), 'id');
      });
    },
    update: function () {
      log.debug("update ");

      //return models.User.findByUserId(userId);
    }
  };
}
