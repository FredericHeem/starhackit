const session = require("koa-generic-session");

function SessionMiddleware(app, koaApp, config) {
  const log = require("logfilename")(__filename);

  koaApp.keys = config.koa.cookieSecret;
  if (config.redis) {
    const Redis = require("ioredis");
    const redisStore = require("koa-redis");
    log.debug("middlewareInit use redis");
    const redis = new Redis(config.redis.url);
    koaApp.use(
      session({
        maxAge: 1000 * 20,
        store: redisStore({ client: redis }),
      })
    );
  } else {
    log.debug("middlewareInit memory session ");
    koaApp.use(session());
  }
}

module.exports = SessionMiddleware;
