const Axios = require("axios");
const _ = require("lodash");
const log = require("logfilename")(__filename);

async function sendToUser(models, user_id, { title, body }) {
  log.debug(`sendToUser: ${user_id}, title: ${title}, body: ${body}`);
  const tokens = await models.pushToken.findAll({ where: { user_id } });
  if (_.isEmpty(tokens)) {
    log.error(`no token for user ${user_id}`);
    return;
  }
  const data = tokens.map(({ token }) => ({ to: token, title, body }));
  log.debug(`sendToUser: data  ${JSON.stringify(data, null, 4)}`);
  await Axios({
    method: "post",
    url: "https://exp.host/--/api/v2/push/send",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}

module.exports.sendToUser = sendToUser;
