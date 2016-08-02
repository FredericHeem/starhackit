import _ from 'lodash';
let log = require('logfilename')(__filename);

export default function UserApi(app) {
  let models = app.data.models();

  return {
    getAll: async function (filter = {}) {
      _.defaults(filter, {
        limit: 100,
        order: 'DESC',
        offset: 0
      });
      log.info('getAll ', filter);
      // TODO try to remove the " when setting the order.
      let result = await models.User.findAndCountAll({
        limit: filter.limit,
        order: `\"createdAt\" ${filter.order}`,
        offset: filter.offset
      });
      log.info(`getAll count: ${result.count}`);
      let users = _.map(result.rows, user => user.toJSON());
      return {
        count: result.count,
        data: users
      };
    },
    getOne: function (userId) {
      log.debug("get userId: ", userId);
      return models.User.findByUserId(userId);
    }
  };
}
