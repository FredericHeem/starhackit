import _ from 'lodash';
import Router from 'koa-66';
import url from 'url';
import oauth from 'oauth';
import Axios from 'axios';
import config from 'config';

let log = require('logfilename')(__filename);

export default function CrossBankPlugin(app){
  const crossBankConfig = _.get(config, 'authentication.crossBank', {});
  const {apiHost, consumerKey, consumerSecret, callbackURL} = crossBankConfig;
  log.debug(`crossBankPlugin apiHost: ${apiHost}`);
  if(!apiHost){
    log.warn(`crossBankPlugin not configured`);
    return;
  }
  //TODO replace SHA1 ?
  const consumer = new oauth.OAuth(
    url.resolve(apiHost,'/oauth/initiate'),
    url.resolve(apiHost,'/oauth/token'),
    consumerKey,
    consumerSecret,
    '1.0',
    callbackURL,
    'HMAC-SHA1');

  // For Direct login
  const axios = Axios.create({
    baseURL: apiHost,
    timeout: 30e3
  });

  async function redirect(context, method, request, data){
    log.debug(`redirect: method: ${method}, request: ${request}`);
    if(!apiHost){
      context.status = 500;
      context.body = {message: "authentication server not configured"};
      return;
    }

    if(context.session.directToken){
      await redirectDirect(context, method, request, data);
    } else {
      await redirectOAuth(context, method, request, data);
    }
  }

  function axiosToKoaError(error, context){
    log.error("axiosToKoaError error", error);
    const {response} = error;
    if(response){
      context.status = response.status;
      context.body = response.data;
    } else {
      context.status = 500;
      context.body = error.message;
    }
  }

  async function redirectDirect(context, method, request, data){
    log.debug(`redirectDirect: method: ${method}, request: ${request}`);
    try {
      const result = await axios({
        method: method,
        url: url.resolve(apiHost, request),
        headers: {
          Authorization: `DirectLogin token="${context.session.directToken}"`
        },
        data
      });
      //log.debug("redirectDirect: data ", result.data);
      context.body = result.data;
      context.status = 200;
    } catch(error){
      log.warning("redirectDirect: error: ", error);
      axiosToKoaError(error, context);
    }
  }
  async function redirectOAuth(context, method, request){
    const {oauthAccessToken, oauthAccessTokenSecret} = context.session;
    const targetUrl = url.resolve(apiHost, request);
    log.debug(`redirectOAuth: targetUrl: ${targetUrl}`);

    if(!oauthAccessToken){
      log.warn(`redirectOAuth: no oauthAccessToken`);
      context.status = 401;
      context.body = {message: "no oauth access token"};
      return;
    }

    return new Promise(resolve => {
        consumer.get(targetUrl,
          oauthAccessToken,
          oauthAccessTokenSecret,
          function (error, data) {
              if(error){
                log.error('redirectOAuth error: ', error);
                context.status = 503;
              } else {
                const parsedData =  JSON.parse(data);
                //log.debug('redirectOAuth data: ', parsedData);
                context.body = parsedData;
                context.status = 200;
              }
              resolve();
          });
    });
  }
  function resetAccessToken(session){
    session.oauthRequestToken = undefined;
    session.oauthRequestTokenSecret = undefined;
    session.oauthAccessToken = undefined;
    session.oauthAccessTokenSecret = undefined;
  }

  function CrossBankHttpController(){
    return {
      async getCurrentUser(context) {
        await redirect(context, 'GET', '/obp/v2.1.0/users/current');
      },
      async getBanks(context) {
        await redirect(context, 'GET', '/obp/v2.1.0/banks');
      },
      async getAccountsByBank(context) {
        const {bankId} = context.params;
        await redirect(context, 'GET', `/obp/v2.1.0/banks/${bankId}/accounts/private`);
      },
      async getAccounts(context) {
        await redirect(context, 'GET', `/obp/v2.1.0/accounts`);
      },
      async getTransactions(context) {
        const {bankId, accountId} = context.params;
        await redirect(context, 'GET', `/obp/v2.1.0/banks/${bankId}/accounts/${accountId}/owner/transactions`);
      },

      async loginDirect(context){
          try {
            //TODO check input parameter
            const {username, password} = context.request.body;
            const result = await axios({
              method: 'POST',
              url: '/my/logins/direct',
              headers: {
                Authorization: `DirectLogin username="${username}", password="${password}", consumer_key="${consumerKey}"`
              }
            });

            context.status = 200;
            context.session.directToken = result.data.token;
          } catch(error){
            log.warn("loginDirect error: ", error);
            axiosToKoaError(error, context);
          }
      },
      async loginOAuth(context) {
        log.debug('loginOAuth: ');
        const {session} = context;
        resetAccessToken(session);
        return new Promise((resolve) => {
          consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret/*, results*/){
            if (error) {
              log.error('loginOAuth: ', error);
              context.status = 500;
              context.body = {error};
            } else {
              session.oauthRequestToken = oauthToken;
              session.oauthRequestTokenSecret = oauthTokenSecret;
              log.debug('loginOAuth session: ', session);
              context.redirect(url.resolve(apiHost, `/oauth/authorize?oauth_token=${oauthToken}`));
            }
            resolve();
          });
        });
      },

      async authCallback(context) {
        return new Promise(resolve => {
          const {session, query} = context;
          //log.debug(`authCallback: query `, query);
          //log.debug(`authCallback: session `, session);
          if(!session.oauthRequestToken){
            log.error('authCallback no oauthRequestToken');
          }
          consumer.getOAuthAccessToken(
            session.oauthRequestToken,
            session.oauthRequestTokenSecret,
            query.oauth_verifier,
            function(error, oauthAccessToken, oauthAccessTokenSecret/*, result*/) {
              log.debug('authCallback oauthAccessToken: ', oauthAccessToken);
              if (error) {
                log.error('authCallback error: ', error);
                resetAccessToken(session);
                context.status = 401;
                context.body = {
                  error: error
                };
              } else {
                log.debug('authCallback ok: ');
                session.oauthAccessToken = oauthAccessToken;
                session.oauthAccessTokenSecret = oauthAccessTokenSecret;
                context.status = 200;
              }
              resolve();
            }
          );
        });
      },
    };
  }

  function CrossBankRouter(){
    if(!crossBankConfig){
      return;
    }
    let router = new Router();
    let crossBankHttpController = CrossBankHttpController(app);
    //OAuth Api
    router.get('/authCallback', crossBankHttpController.authCallback);
    router.get('/login', crossBankHttpController.loginOAuth);
    //Direct Login Api
    router.post('/my/logins/direct', crossBankHttpController.loginDirect);
    //All other API
    router.get('/getCurrentUser', crossBankHttpController.getCurrentUser);
    router.get('/banks', crossBankHttpController.getBanks);
    router.get('/accounts', crossBankHttpController.getAccounts);
    router.get('/banks/:bankId/accounts/private', crossBankHttpController.getAccountsByBank);
    router.get('/banks/:bankId/accounts/:accountId/owner/transactions', crossBankHttpController.getTransactions);

    //Mount to /crossBank
    app.server.baseRouter().mount("/crossBank", router);
    return router;
  }

  CrossBankRouter(app);
  return {
    async start(){
    },
    async stop(){
    }
  };
}
