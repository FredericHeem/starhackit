const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");

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
