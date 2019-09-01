const session = require("koa-generic-session");
const redisStore = require("koa-redis");
const Redis = require('ioredis');

function SessionMiddleware(app, koaApp, config) {
  const log = require("logfilename")(__filename);
  
  koaApp.keys = config.koa.cookieSecret;
  if (config.redis) {
    log.debug("middlewareInit use redis");
    const redis = new Redis(config.redis.url);
    koaApp.use(
      session(
        {
          maxAge: 1000*20,
          store: redisStore({client: redis})
        }
      )
    );
  } else {
    log.debug("middlewareInit memory session ");
    koaApp.use(session());
  }
}

module.exports = SessionMiddleware;
