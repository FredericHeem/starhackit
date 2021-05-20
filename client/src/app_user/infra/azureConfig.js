/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable } from "mobx";
import { observer } from "mobx-react";

import form from "mdlean/lib/form";
import button from "mdlean/lib/button";
import input from "mdlean/lib/input";
import formGroup from "mdlean/lib/formGroup";

export default (context) => {
  const {
    tr,
    emitter,
    theme: { palette },
  } = context;

  const Form = form(context);
  const Button = button(context);
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      input {
        width: 25rem;
      }
    `,
  });

  const store = observable({
    map: observable.map(),
    errors: {},
    get isDisabled() {
      return store.map.size < 4;
    },
    nextStep: () => {
      emitter.emit("step.select", "Scan");
    },
  });

  return observer(() => (
    <Form>
      <main>
        <p>
          Please follow the instructions to setup a service principal used by
          Grucloud to scan an Azure infrastructure.{" "}
        </p>
        <ol
          css={css`
            list-style: none;
            counter-reset: counter;
            padding-left: 40px;
            > li {
              counter-increment: counter;
              margin: 0 0 0.5rem 0;
              position: relative;
              ::before {
                background-color: ${palette.primary.main};
                color: ${palette.primary.contrastText};
                content: counter(counter) ".";
                font-weight: bold;
                position: absolute;
                --size: 32px;
                left: calc(-1 * var(--size) - 10px);
                line-height: var(--size);
                width: var(--size);
                height: var(--size);
                top: -0.3rem;
                border-radius: 50%;
                text-align: center;
              }
            }
          `}
        >
          <li>
            <h3>Subscription ID</h3>
            <p>
              Retrieve the <em>Subscription ID</em> with the following command:{" "}
            </p>
            <pre>az account show --query id -otsv</pre>
            <Input
              value={store.map.get("subscriptionId")}
              onChange={(e) => {
                store.map.set("subscriptionId", e.target.value);
              }}
              label={tr.t("Subscription Id")}
              error={store.errors.name && store.errors.name[0]}
            />
          </li>
          <li>
            <h3>Tenant ID</h3>
            <p>
              Retrieve the <em>tenantId</em> with the following command:{" "}
              <pre>az account show</pre>
            </p>
            <Input
              value={store.map.get("tenantId")}
              onChange={(e) => {
                store.map.set("tenantId", e.target.value);
              }}
              label={tr.t("Tenant Id")}
              error={store.errors.name && store.errors.name[0]}
            />
          </li>
          <li>
            <h3>App ID and password</h3>
            <p>
              Retrieve the <em>appId</em> and <em>password</em> by creating a
              service principal called grucloud:
              <pre>az ad sp create-for-rbac -n "grucloud"</pre>
            </p>
            <FormGroup>
              <Input
                value={store.map.get("appId")}
                onChange={(e) => {
                  store.map.set("appId", e.target.value);
                }}
                label={tr.t("App Id")}
                error={store.errors.name && store.errors.name[0]}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                value={store.map.get("password")}
                onChange={(e) => {
                  store.map.set("password", e.target.value);
                }}
                label={tr.t("Password")}
                error={store.errors.name && store.errors.name[0]}
              />
            </FormGroup>
          </li>
        </ol>
      </main>
      <footer>
        <Button
          onClick={() => emitter.emit("step.select", "ProviderSelection")}
        >
          {"\u25c0"} Back
        </Button>
        <Button
          disabled={store.isDisabled}
          raised
          primary
          onClick={() => store.nextStep()}
        >
          Save and Scan
        </Button>
      </footer>
    </Form>
  ));
};
