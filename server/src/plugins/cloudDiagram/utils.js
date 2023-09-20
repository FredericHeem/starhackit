const assert = require("assert");
const { fork, pipe, tap, get, switchCase } = require("rubico");
const { isEmpty } = require("rubico/x");

exports.middlewareUserBelongsToOrg = (models) => (context, next) =>
  pipe([
    () => context,
    tap(() => {
      assert(models.userOrg);
    }),
    fork({
      org_id: get("params.org_id"),
      user_id: get("state.user.user_id"),
    }),
    tap(({ user_id, org_id }) => {
      assert(user_id);
      assert(org_id);
    }),
    (where) => ({ attributes: ["user_id"], where }),
    models.userOrg.findOne,
    tap((context) => {
      assert(context);
    }),
    switchCase([
      isEmpty,
      () => {
        context.status = 401;
        context.body = "Unauthorized";
      },
      () => next(),
    ]),
  ])();
