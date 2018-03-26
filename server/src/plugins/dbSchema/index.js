//import _ from 'lodash';
import Router from 'koa-66';
import PgSchema from './PgSchema';
//import config from 'config';
let log = require('logfilename')(__filename);

export default function DbSchemaPlugin(app){
  log.debug("DbSchemaPlugin ");

  function DbSchemaHttpController(){
    return {
      async getSchema(context) {
        //let schema = {};
        //let transactions = await pipeApi(context, '/transactions');
        try {
          const schema = await PgSchema.toJSON(app.data.sequelize, 'public');
          context.status = 200;
          context.body = schema;
        } catch(error){
          log.error("getSchema ", error);
          context.body = error;
        }

      }
    };
  }

  function DbSchemaRouter(){
    let router = new Router();
    let dbSchemaHttpController = DbSchemaHttpController(app);
    router.get('/schema', dbSchemaHttpController.getSchema);
    app.server.baseRouter().mount("/db", router);
    return router;
  }

  DbSchemaRouter();

  return {
    async start(){
    },
    async stop(){
    }
  };
}
