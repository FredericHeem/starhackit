const assert = require("assert");
const { pipe, tap, tryCatch, fork } = require("rubico");

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

exports.createInfra = ({
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

exports.pushCodeFromTemplate = ({ client }) =>
  pipe([
    tap(({ infra }) => {
      assert(infra.id);
    }),
    tap(({ infra }) => client.post(`v1/infra/${infra.id}/push_code`, {})),
  ]);
