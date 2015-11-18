let log = require('logfilename')(__filename);

export default function UserApi(app) {
  let models = app.data.models();

  return {
    list: function (qs) {
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
