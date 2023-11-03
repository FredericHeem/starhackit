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
    switchCase([
      get("org_id"),
      pipe([
        tap(({ user_id, org_id }) => {
          assert(user_id);
          assert(org_id);
        }),
        (where) => ({ attributes: ["user_id"], where }),
        models.userOrg.findOne,
        switchCase([
          isEmpty,
          () => {
            context.status = 404;
            context.body = "NotFound";
          },
          () => next(),
        ]),
      ]),
      // no org_id, pass through
      () => next(),
    ]),
  ])();
