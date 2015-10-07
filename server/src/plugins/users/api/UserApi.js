import Log from 'logfilename';

export default function UserApi (app){
  let models = app.data.sequelize.models;
  let log = new Log(__filename);
  return {
    list: function(qs){
      log.debug("list qs: ", qs);
      let filter = app.data.queryStringToFilter(qs, "id");
      return models.User.findAll(filter);
    },
    get: function (userId) {
      log.debug("get userId: ", userId);
      return models.User.findByUserId(userId);
    }
  };
}
