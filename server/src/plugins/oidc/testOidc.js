const assert = require("assert");
const { tap, tryCatch, pipe, get } = require("rubico");
const testMngr = require("test/testManager");
const Axios = require("axios");
const jose = require("jose");
const {
  AssumeRoleWithWebIdentityCommand,
  STSClient,
} = require("@aws-sdk/client-sts");
const { ListBucketsCommand, S3Client } = require("@aws-sdk/client-s3");

const AZ_AUTHORIZATION_URL = "https://login.microsoftonline.com";
const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
const GOOGLE_SA_EMAIL = "grucloud@grucloud-test.iam.gserviceaccount.com";
const project_id = "grucloud-test";
//const tokenUrl = `http://localhost:9000/oidc/token`;
const tokenUrl = `https://demo.grucloud.com/oidc/token`;

const subject =
  "organization:my-org:project:my-project:workspace:my-workspace:run_phase:plan";
const audience =
  "//iam.googleapis.com/projects/91170824493/locations/global/workloadIdentityPools/demo-grucloud/providers/grucloud";

const RoleArn = "arn:aws:iam::840541460064:role/role-grucloud";
const AWS_REGION = "us-east-1";
const client = new STSClient({
  region: AWS_REGION,
});

const getJwt = ({ tokenUrl, subject }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => ({
      method: "POST",
      url: tokenUrl,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: subject,
        client_secret: "bar",
        resource: "uri:app",
        scope: "openid",
      }),
    }),
    Axios.request,
    get("data"),
    tap(({ access_token }) => {
      assert(access_token);
    }),
    get("access_token"),
    tap(
      pipe([
        jose.decodeJwt,
        tap((pcarams) => {
          assert(true);
        }),
      ])
    ),
  ])();

const awsAssumeRoleWebIdentity = ({ RoleArn, RoleSessionName }) =>
  pipe([
    tap((WebIdentityToken) => {
      assert(WebIdentityToken);
      assert(RoleArn);
    }),
    (WebIdentityToken) => ({
      WebIdentityToken,
      RoleSessionName,
      RoleArn,
    }),
    (input) => new AssumeRoleWithWebIdentityCommand(input),
    (command) => client.send(command),
    get("Credentials"),
    ({ AccessKeyId, SecretAccessKey, SessionToken }) =>
      new S3Client({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AccessKeyId,
          secretAccessKey: SecretAccessKey,
          sessionToken: SessionToken,
        },
      }),
    (s3client) =>
      pipe([
        () => ({}),
        (input) => new ListBucketsCommand(input),
        (command) => s3client.send(command),
        tap((params) => {
          assert(true);
        }),
      ])(),
  ]);

const azureAuthenticateFederated = ({
  tenantId,
  clientId,
  scope = "https://management.azure.com/.default",
}) =>
  pipe([
    tap((WebIdentityToken) => {
      assert(WebIdentityToken);
      assert(tenantId);
      assert(clientId);
    }),
    (WebIdentityToken) => ({
      method: "POST",
      url: `${AZ_AUTHORIZATION_URL}/${tenantId}/oauth2/v2.0/token`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "client_credentials",
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion: WebIdentityToken,
        client_id: clientId,
        scope,
      }),
    }),
    Axios.request,
    get("data"),
    tap(({ access_token }) => {
      assert(access_token);
    }),
    //https://management.azure.com/subscriptions/bff6898b-a5ee-46dc-b7b6-c163dbf1bfbd/resources?api-version=2021-04-01
    ({ access_token }) => ({
      method: "GET",
      url: `https://management.azure.com/subscriptions/${subscriptionId}/resources?api-version=2021-04-01`,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }),
    Axios.request,
    tap((params) => {
      assert(true);
    }),
  ]);

const googleAuthenticateFederated = ({
  audience,
  GOOGLE_SA_EMAIL,
  scope = "https://www.googleapis.com/auth/cloud-platform",
}) =>
  pipe([
    tap((subjectToken) => {
      assert(subjectToken);
      assert(audience);
      assert(GOOGLE_SA_EMAIL);
    }),
    (subjectToken) => ({
      method: "POST",
      url: `https://sts.googleapis.com/v1/token`,
      headers: { "content-type": "application/json" },
      data: {
        audience,
        grantType: "urn:ietf:params:oauth:grant-type:token-exchange",
        requestedTokenType: "urn:ietf:params:oauth:token-type:access_token",
        scope,
        subjectTokenType: "urn:ietf:params:oauth:token-type:jwt",
        subjectToken,
      },
    }),
    Axios.request,
    get("data"),
    tap(({ access_token }) => {
      assert(access_token);
    }),
    ({ access_token }) => ({
      method: "POST",
      url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GOOGLE_SA_EMAIL}:generateAccessToken`,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      data: {
        scope,
      },
    }),
    Axios.request,
    get("data.accessToken"),
    tap((accessToken) => {
      assert(accessToken);
    }),
    (accessToken) => ({
      method: "GET",
      url: `https://iam.googleapis.com/v1/projects/${project_id}/serviceAccounts`,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    Axios.request,
    tap((params) => {
      assert(true);
    }),
  ]);

describe.only("Oicd", function () {
  const { config } = testMngr.app;
  before(async function () {
    if (!testMngr.app.config.oidc) {
      this.skip();
      assert(process.env.AZURE_TENANT_ID);
      assert(subscriptionId);
    }
  });
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
  it("demo well-known openid-configuration", () =>
    tryCatch(
      pipe([
        tap((params) => {
          assert(true);
        }),
        // Check nginx is configured properly
        () => `https://demo.grucloud.com/.well-known/openid-configuration`,
        Axios.get,
        get("data"),
        tap((data) => {
          console.log(JSON.stringify(data, null, 4));
        }),
        tap(({ authorization_endpoint }) => {
          assert.equal(
            authorization_endpoint,
            "https://demo.grucloud.com/oidc/auth"
          );
        }),
      ]),
      (error) => {
        throw error;
      }
    )());
  it("jwks", () =>
    tryCatch(
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => `http://localhost:9000/oidc/jwks`,
        Axios.get,
        get("data"),
        tap((data) => {
          //console.log(JSON.stringify(data, null, 4));
        }),
        tap(({ keys }) => {
          assert(keys);
          assert(keys[0].use, "sig");
        }),
      ]),
      (error) => {
        throw error;
      }
    )());
  it("aws client auth", () =>
    tryCatch(
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => ({
          tokenUrl,
          subject:
            "organization:my-org:project:my-project:workspace:my-workspace:run_phase:plan",
        }),
        getJwt,
        awsAssumeRoleWebIdentity({
          RoleArn,
          RoleSessionName: "gc-session",
        }),
        tap((params) => {
          assert(true);
        }),
      ]),
      (error) => {
        throw error;
      }
    )());
  it("azure client auth", () =>
    tryCatch(
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => ({
          tokenUrl,
          subject,
        }),
        getJwt,
        azureAuthenticateFederated({
          tenantId: process.env.AZURE_TENANT_ID,
          clientId: process.env.AZURE_CLIENT_ID,
          subject,
        }),
      ]),
      (error) => {
        throw error;
      }
    )());
  it("gcp client auth", () =>
    tryCatch(
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => ({
          tokenUrl,
          subject,
        }),
        getJwt,
        googleAuthenticateFederated({
          audience,
          GOOGLE_SA_EMAIL,
        }),
      ]),
      (error) => {
        throw error;
      }
    )());
});
