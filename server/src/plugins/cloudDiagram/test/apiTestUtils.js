const assert = require("assert");
const { pipe, tap, tryCatch, fork } = require("rubico");
const { first } = require("rubico/x");

exports.apiTestCrud = ({ client, endpoint, payloadCreate, payloadUpdate }) =>
  tryCatch(
    pipe([
      () => client.post(endpoint, payloadCreate),
      tap(({ id }) => {
        assert(id);
      }),
      ({ id }) =>
        pipe([
          () => client.get(`${endpoint}/${id}`),
          tap((result) => {
            assert(result);
          }),
          () => client.patch(`${endpoint}/${id}`, payloadUpdate),
          () => client.get(`${endpoint}/${id}`),
          tap((result) => {
            assert(result);
          }),
          () => client.get(endpoint),
          tap((results) => {
            assert(Array.isArray(results));
          }),
          () => client.delete(`${endpoint}/${id}`),
          tryCatch(
            pipe([
              () => client.get(`${endpoint}/${id}`),
              () => {
                assert(false, "should not be here");
              },
            ]),
            (error) => {
              assert.equal(error.response.status, 404);
            }
          ),
        ])(),
    ]),
    (error) => {
      throw error;
    }
  )();

const createInfra = ({
  client,
  config: { infra, gitCredential, gitRepository },
}) =>
  pipe([
    fork({
      infra: () => client.post("v1/infra", infra),
      credential: () => client.post("v1/git_credential", gitCredential),
      repository: () => client.post("v1/git_repository", gitRepository),
    }),
    tap(({ infra, credential, repository }) =>
      client.patch(`v1/infra/${infra.id}`, {
        id: infra.id,
        git_credential_id: credential.id,
        git_repository_id: repository.id,
      })
    ),
  ]);

exports.createInfra = createInfra;

const pushCodeFromTemplate = ({ client }) =>
  pipe([
    tap(({ infra }) => {
      assert(infra.id);
    }),
    tap(({ infra }) => client.post(`v1/infra/${infra.id}/push_code`, {})),
  ]);

exports.pushCodeFromTemplate = pushCodeFromTemplate;

exports.testInfra = ({ client, config }) =>
  pipe([
    createInfra({ client, config }),
    tap(({ infra }) => {
      assert(infra);
    }),
    ({ infra }) =>
      pipe([
        () => ({ infra }),
        pushCodeFromTemplate({ client }),
        () => ({
          id: infra.id,
          provider_auth: config.infra.provider_auth,
        }),
        tap((input) => {
          assert(input);
        }),
        (input) => client.patch(`v1/infra/${input.id}`, input),
        tap((result) => {
          assert(result);
        }),
        () => ({
          options: {},
          infra_id: infra.id,
        }),
        (input) => client.post("v1/cloudDiagram", input),
        tap((result) => {
          assert(result);
          //TODO add jobId
        }),
        () => client.get("v1/cloudDiagram"),
        // List
        tap((results) => {
          assert(Array.isArray(results));
        }),
        first,
        tap(({ id }) => client.get(`v1/cloudDiagram/${id}`)),
        tap((result) => {
          assert(result);
          assert(result.id);
          assert(result.user_id);
        }),
        tap(({ id }) => client.delete(`v1/cloudDiagram/${id}`)),
        tap((xxx) => {
          assert(true);
        }),
        tap(() => client.delete(`v1/infra/${infra.id}`)),
      ])(),
  ]);
