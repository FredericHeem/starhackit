/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import validate from "validate.js";

import AsyncOp from "mdlean/lib/utils/asyncOp";
import button from "mdlean/lib/button";
import input from "mdlean/lib/input";
import formGroup from "mdlean/lib/formGroup";
import spinner from "mdlean/lib/spinner";
import createForm from "mdlean/lib/form";
import alert from "mdlean/lib/alert";

import awsSelectRegion from "./awsSelectRegion";

const rules = {
  infraName: {
    presence: true,
    length: {
      minimum: 3,
      message: "must be at least 3 characters",
    },
  },
  accessKeyId: {
    presence: true,
    length: {
      minimum: 20,
      message: "must be at least 20 characters",
    },
  },
  secretKey: {
    presence: true,
    length: {
      minimum: 40,
      message: "must be at least 40 characters",
    },
  },
};

const awsConfig = (context) => {
  const {
    tr,
    history,
    theme: { palette },
    alertStack,
    rest,
    emitter,
  } = context;
  const Alert = alert(context);
  const Form = createForm(context);
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 300px;
      }
    `,
  });
  const Spinner = spinner(context);
  const AwsSelectRegion = awsSelectRegion(context);
  const Button = button(context, {
    cssOverride: css``,
  });
  const asyncOpCreate = AsyncOp(context);

  const defaultData = {
    name: "",
    accessKeyId: "",
    secretKey: "",
    region: "us-east-1",
  };

  const store = observable({
    data: defaultData,
    errors: {},
    reset: action(() => {
      store.data = defaultData;
    }),
    setData: action((data) => {
      store.data = data;
    }),
    opScan: asyncOpCreate((infraItem) =>
      rest.post(`cloudDiagram`, { infra_id: infraItem.id })
    ),
    op: asyncOpCreate((payload) => rest.post("infra", payload)),
    create: action(async () => {
      store.errors = {};
      const { data } = store;

      const constraints = {
        name: rules.infraName,
        accessKeyId: rules.accessKeyId,
        secretKey: rules.secretKey,
      };

      const vErrors = validate(data, constraints);
      if (vErrors) {
        store.errors = vErrors;
        return;
      }
      const payload = {
        name: data.name,
        providerType: "aws",
        providerAuth: {
          AWSAccessKeyId: data.accessKeyId.trim(),
          AWSSecretKey: data.secretKey,
          AWS_REGION: data.region,
        },
      };
      try {
        const result = await store.op.fetch(payload);
        await store.opScan.fetch(result);
        alertStack.add(
          <Alert severity="success" message={tr.t("Infrastructure Created")} />
        );
        history.push(`/infra/detail/${result.id}`, result);
        emitter.emit("infra.created", result);
      } catch (errors) {
        console.log(errors);

        // backend should 422 if the credentials are incorrect

        alertStack.add(
          <Alert
            severity="error"
            data-alert-error-create
            message={tr.t(
              "Error creating infrastructure, check the credentials"
            )}
          />
        );
      }
    }),
  });

  return observer(() => (
    <Form spellCheck="false" autoCapitalize="none" data-infra-create>
      <header>
        <h2>{tr.t("Create new Infrastructure")}</h2>
      </header>
      <main>
        <div>
          {tr.t(
            "Please provide the following information to create and scan a new infrastructure"
          )}
        </div>
        <FormGroup className="infra-name">
          <Input
            autoFocus
            value={store.data.name}
            onChange={(e) => {
              store.data.name = e.target.value;
            }}
            label={tr.t("Infrastructure Name")}
            error={store.errors.name && store.errors.name[0]}
          />
        </FormGroup>
        <FormGroup className="access-key">
          <Input
            value={store.data.accessKeyId}
            onChange={(e) => {
              store.data.accessKeyId = e.target.value;
            }}
            autoComplete="off"
            label={tr.t("AWS Access Key Id")}
            error={store.errors.accessKeyId && store.errors.accessKeyId[0]}
          />
        </FormGroup>
        <FormGroup className="secret-key">
          <Input
            value={store.data.secretKey}
            onChange={(e) => {
              store.data.secretKey = e.target.value;
            }}
            label={tr.t("AWS Secret Key")}
            type="password"
            error={store.errors.secretKey && store.errors.secretKey[0]}
          />
        </FormGroup>
        <FormGroup className="aws-region">
          <AwsSelectRegion
            placeholder="Select a region"
            value={store.data.region}
            onSelected={(item) => {
              store.data.region = item;
            }}
          />
        </FormGroup>
      </main>
      <footer>
        <Button
          onClick={() => emitter.emit("step.select", "ProviderSelection")}
        >
          {"\u25c0"} Back
        </Button>

        <Button
          data-infra-create-submit
          primary
          raised
          disabled={store.opScan.loading || store.op.loading}
          onClick={() => store.create()}
          label={tr.t("Create Infrastructure")}
        />
        <Spinner
          css={css`
            visibility: ${store.opScan.loading ? "visible" : "hidden"};
          `}
          color={palette.primary.main}
        />
      </footer>
    </Form>
  ));
};

export default awsConfig;
