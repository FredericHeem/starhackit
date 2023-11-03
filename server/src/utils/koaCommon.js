const assert = require("assert");

exports.contextSet400 =
  ({ context, message }) =>
  () => {
    context.status = 400;
    context.body = {
      error: {
        code: 400,
        name: "BadRequest",
        message,
      },
    };
  };

exports.contextSet404 =
  ({ context }) =>
  () => {
    context.status = 404;
    context.body = {
      error: {
        code: 404,
        name: "NotFound",
      },
    };
  };

exports.contextSetOk =
  ({ context }) =>
  (body) => {
    context.status = 200;
    context.body = body;
  };

exports.contextSet =
  ({ context }) =>
  ({ body, status }) => {
    context.status = status;
    context.body = body;
  };
