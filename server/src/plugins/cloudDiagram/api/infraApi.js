const assert = require("assert");
const path = require("path");
const { pipe, tap, switchCase, map } = require("rubico");
const { isEmpty, callProp, defaultsDeep } = require("rubico/x");
const fs = require("fs");
const pfs = fs.promises;
const os = require("os");
const { gitPush } = require("../gitUtils");
const { createRestApiByUser } = require("../apiFactory");

const infraFindOne = ({ models }) =>
  pipe([
    ({ id }) =>
      models.Infra.findOne({
        include: [
          {
            model: models.Job,
            limit: 1,
            order: [["created_at", "DESC"]],
          },
          {
            model: models.GitCredential,
            as: "gitCredential",
          },
          {
            model: models.GitRepository,
            as: "gitRepository",
          },
          {
            model: models.User,
            as: "user",
          },
        ],
        where: {
          id,
        },
      }),
    switchCase([isEmpty, () => undefined, callProp("toJSON")]),
  ]);

exports.infraFindOne = infraFindOne;

const InfraApi = ({ models, model, log }) => ({
  findOne: infraFindOne({ models }),
  findAll: ({ user_id }) =>
    pipe([
      () =>
        model.findAll({
          include: [
            {
              model: models.Job,
              limit: 1,
              order: [["created_at", "DESC"]],
            },
            {
              model: models.GitCredential,
              as: "gitCredential",
            },
            {
              model: models.GitRepository,
              as: "gitRepository",
            },
            {
              model: models.User,
              as: "user",
            },
          ],
          where: {
            user_id,
          },
        }),
      map(callProp("toJSON")),
      tap((xxx) => {
        assert(true);
      }),
    ])(),
  create: ({ data }) =>
    pipe([
      () => model.create(data),
      tap((xxx) => {
        assert(true);
      }),
      callProp("toJSON"),
      tap((param) => {
        log.debug(`created infra result: ${JSON.stringify(param, null, 4)}`);
      }),
      ({ id }) => infraFindOne({ models })({ id }),
      tap((param) => {
        log.debug(`created infraFindOne: ${JSON.stringify(param, null, 4)}`);
      }),
      tap(async (infra) =>
        gitPush({
          infra,
          dirTemplate: await path.join(
            os.tmpdir(),
            "grucloud-example-template"
          ),
          dir: await pfs.mkdtemp(path.join(os.tmpdir(), "grucloud-template")),
          message: "new infra project",
        })
      ),
    ])(),
  patch: ({ id, data }) =>
    pipe([
      () => infraFindOne({ models })({ id }),
      (current) => defaultsDeep(current)(data),
      tap((merged) =>
        model.update(merged, {
          where: {
            id,
          },
        })
      ),
      () => infraFindOne({ models })({ id }),
      tap((param) => {
        log.debug(`created infraFindOne: ${JSON.stringify(param, null, 4)}`);
      }),
    ])(),
  destroy: ({ id }) =>
    pipe([
      () =>
        model.destroy({
          where: {
            id,
          },
        }),
    ])(),
});

exports.InfraRestApi = (app) => {
  const log = require("logfilename")(__filename);
  const { models } = app.data.sequelize;
  const api = InfraApi({ model: models.Infra, models, log });
  return createRestApiByUser({ pathname: "infra", api, app });
};
