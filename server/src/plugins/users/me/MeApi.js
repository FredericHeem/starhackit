import _ from 'lodash';

let log = require('logfilename')(__filename);

export default function MeApi(app) {
  let models = app.data.models();
  let validateJson = app.utils.api.validateJson;

  return {
    async getByUserId(userId) {
      log.debug("index userId: ", userId);
      let user = await models.User.findByUserId(userId);
      //log.debug("index user: ", user.get());
      return _.omit(user.toJSON(), 'id');
    },
    async patch(userId, data) {
      validateJson(data, require('./schema/patch.json'));
      log.debug("patch userId %s, data: ", userId, data);
      //TODO refactor with nested data
      await models.User.update(data, {
        where: {
          id: userId
        }
      });
      await models.Profile.update(data, {
        where: {
          user_id: userId
        }
      });
      log.debug("patch done");
      let updatedUser = await this.getByUserId(userId);
      return updatedUser;
    }
  };
}
