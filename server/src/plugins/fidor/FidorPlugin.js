import _ from 'lodash';
import Router from 'koa-66';
import Axios from 'axios';
import URI from 'urijs';

import config from 'config';
//var https         = require("https")
//var url           = require("url")
let log = require('logfilename')(__filename);

export default function fidorPlugin(app){
  let fidorConfig = config.authentication.fidor;
  log.debug("fidorPlugin ", JSON.stringify(fidorConfig));

  async function redirectApi(context, request){
    let accessToken = _.get(context, 'passport.user');
    log.debug(`redirectApi: accessToken ${accessToken} request: ${request}`, request);
    if(!accessToken){
      context.status = 401;
      context.body = {message: "no access token"};
      return;
    }
    let {apiURL} = fidorConfig;
    if(!apiURL){
      context.status = 500;
      context.body = {message: "not configured"};
      return;
    }
    let url = URI(apiURL).path(request).toString();
    log.debug('redirectApi url ', url);
    try {
      let res = await Axios({
        method: 'get',
        url: url,
        headers: {
          Authorization: "Bearer "+accessToken,
          Accept: "application/vnd.fidor.de; version=1,text/json"
        }
      });
      let data = res.data;
      log.debug(res.data);
      if(data.error){
        log.error('redirectApi error: ', data.error);
        //throw formatError(data.error);
        context.body = {
          error: data.error
        };
        context.status = 503;
      } else {
        context.body = data;
        context.status = 200;
      }
    } catch(error){
      log.error('redirectApi error: ', error);
      context.status = 503;
    }
    log.debug('redirectApi done');

  }

  function FidorHttpController(){
    return {
      async getTransactions(context) {
        let transactions = await redirectApi(context, '/transactions');
        //let transactions = await pipeApi(context, '/transactions');
        return transactions;
      },
      async getAccounts(context) {
        return await redirectApi(context, '/accounts');
      }
    };
  }

  function FidorRouter(){
    if(!fidorConfig){
      return;
    }
    let router = new Router();
    let fidorHttpController = FidorHttpController(app);
    router.get('/transactions', fidorHttpController.getTransactions);
    router.get('/accounts', fidorHttpController.getAccounts);
    app.server.baseRouter().mount("/fidor", router);
    return router;
  }

  FidorRouter(app);
  return {
    async start(){
    },
    async stop(){
    }
  };
}
