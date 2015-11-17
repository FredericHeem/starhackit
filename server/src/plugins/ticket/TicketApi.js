import path from 'path';
let log = require('logfilename')(__filename);

export default function(app) {
  let sequelize = app.data.sequelize;
  let models = sequelize.models;

  sequelize['import'](path.join(__dirname, './TicketModel'));

  return {
    getAll: async function () {
      let tickets = await models.Ticket.findAll();
      log.debug("getAll: ", tickets);
      return tickets;
    }
  };
}
