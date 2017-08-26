export default function(app, koaApp, config) {
  let log = require("logfilename")(__filename);
  if(!config.koa.logger){
      return;
  }
  koaApp.use(async (ctx, next) => {
    const start = new Date();
    log.debug(`${ctx.method} ${ctx.url} begins`);
    log.debug(`${JSON.stringify(ctx.header, 4, null)}`);
    await next();
    const ms = new Date() - start;
    log.debug(`${ctx.method} ${ctx.url} ends in ${ms}ms, code: ${ctx.status}`);
  });
}
