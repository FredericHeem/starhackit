let log = require('logfilename')(__filename);

export default function UserApi(app) {
  let models = app.data.models();

  return {
    getAll: function (qs) {
      log.debug("list qs: ", qs);
      let filter = app.data.queryStringToFilter(qs, "id");
      return models.User.findAll(filter);
    },
    getOne: function (userId) {
      log.debug("get userId: ", userId);
      return models.User.findByUserId(userId);
    }
  };
}
