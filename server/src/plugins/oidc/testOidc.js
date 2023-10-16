const fs = require("fs");
const assert = require("assert");
const { tap, tryCatch, pipe, get } = require("rubico");
const testMngr = require("test/testManager");
const Axios = require("axios");

describe("Oicd", function () {
  const { config } = testMngr.app;
  before(async function () {
    if (!testMngr.app.config.oidc) {
      this.skip();
    }
  });
  after(async () => {});

  it("well-known openid-configuration", () =>
    tryCatch(
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => `http://localhost:9000/oidc/.well-known/openid-configuration`,
        Axios.get,
        get("data"),
        tap((data) => {
          assert(true);
          console.log(JSON.stringify(data, null, 4));
        }),
      ]),
      (error) => {
        throw error;
      }
    )());
});
