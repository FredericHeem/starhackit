/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action, runInAction } from "mobx";
import React, { createElement as h } from "react";
import button from "mdlean/lib/button";
import alertAjax from "components/alertAjax";
import formGroup from "components/FormGroup";
import input from "mdlean/lib/input";
import { observer } from "mobx-react";
import { get, pipe, map } from "rubico";
import { size, forEach } from "rubico/x";

import AsyncOp from "utils/asyncOp";
import alert from "components/alert";
import page from "components/Page";
import spinner from "components/spinner";

const createInfra = (context) => {
  const {
    tr,
    history,
    rest,
    theme: { palette },
  } = context;
  const Button = button(context, {
    cssOverride: css``,
  });
  const Spinner = spinner(context);

  const ResourcePerTypeTable = ({ lives }) => (
    <table
      css={css`
        //border: 1px solid green;
        box-shadow: 2px 2px 2px 2px grey;
        min-width: 200px;
        border-collapse: collapse;
        border-spacing: 0;
        padding: 10px;
        margin: 6px;
        & td,
        & th {
          padding: 0.5rem 1rem 0.5rem 1rem;
        }
      `}
    >
      <thead>
        <tr>
          <th>Resource Type</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {lives.map((live) => (
          <tr key={live.type}>
            <td>{live.type}</td>
            <td>{live?.resources.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const InfraLive = ({ lives, svg }) => (
    <div
      css={css`
        //border: 1px solid blue;
        display: flex;
      `}
    >
      <ResourcePerTypeTable lives={lives} />

      <span
        css={css`
          svg {
            height: 800px;
          }
        `}
        dangerouslySetInnerHTML={{
          __html: svg,
        }}
      />
    </div>
  );

  const Infra = ({ item, store }) => {
    return (
      <div
        css={css`
          //border: 1px solid red;
          box-shadow: 2px 2px 2px 2px grey;
          margin: 1rem;
          padding: 1rem;
        `}
      >
        <header
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div>
            <div>{item.name}</div>
            <div>Provider Type: {item.providerType}</div>
            <div>{item.providerAuth.region}</div>
          </div>

          <Button
            primary
            onClick={() => store.scan(item)}
            icon={store.scanMap.get(item.id)?.loading && <Spinner />}
            label={
              store.scanMap.get(item.id)?.loading
                ? tr.t("Scanning...")
                : tr.t("New Scan")
            }
          />
          <Button
            primary
            onClick={() => {
              history.push("infra/edit", {
                name: item.name,
                region: item.providerAuth.region,
                accessKeyId: item.providerAuth.AWSAccessKeyId,
                secretKey: item.providerAuth.AWSSecretKey,
              });
            }}
            label={tr.t("Edit Settings")}
          />
        </header>
        <pre
          css={css`
            max-width: 500px;
            max-height: 500px;
          `}
        ></pre>

        {item.Jobs[0] && (
          <InfraLive
            svg={get("Jobs[0].result.svg")(item)}
            lives={get("Jobs[0].result.list.result.results[0].results")(item)}
          />
        )}
      </div>
    );
  };
  return observer(Infra);
};

const createInfraNew = (context) => {
  const { tr, history } = context;
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 300px;
      }
    `,
  });
  ///const AlertAjax = alertAjax(context);
  //const asyncOpCreate = AsyncOp(context);
  const Button = button(context, {
    cssOverride: css``,
  });

  const InfraNew = ({ store, onClick, title, buttonTitle }) => (
    <form
      onSubmit={(e) => e.preventDefault()}
      css={css`
        border: 1px solid blue;
        display: flex;
        flex-direction: column;
        padding: 1rem;
      `}
    >
      <h2>{title}</h2>
      <div>
        Please provide the following information to create a new infrastructure{" "}
      </div>
      <FormGroup className="infra-name">
        <Input
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
          label={tr.t("AWS Access Key")}
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
      <FormGroup className="region">
        <Input
          value={store.data.region}
          onChange={(e) => {
            store.data.region = e.target.value;
          }}
          label={tr.t("Region")}
          error={store.errors.region && store.errors.region[0]}
        />
      </FormGroup>
      <FormGroup
        css={css`
          button {
            margin: 10px;
          }
        `}
      >
        <Button primary raised onClick={onClick} label={tr.t(buttonTitle)} />
        <Button
          onClick={() => history.push(`/user/infra`)}
          label={tr.t("Cancel")}
        />
      </FormGroup>
    </form>
  );
  return observer(InfraNew);
};

const createInfraList = (context) => {
  const { tr, history } = context;
  const Page = page(context);
  const Button = button(context, {
    cssOverride: css`
      width: 256px;
    `,
  });
  const Infra = createInfra(context);

  const InfraListView = ({ store }) => (
    <div
      css={css`
        //border: 1px solid red;
        width: 95%;
      `}
    >
      <header
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <h2>Your Infrastructures</h2>
        <Button
          primary
          raised
          onClick={() => history.push(`infra/create`)}
          label={tr.t("+ New Infrastructure")}
        />
      </header>

      {store?.opGet?.data?.map((datum, key) => (
        <Infra
          store={store}
          item={datum}
          key={key}
          onScan={(item) => store.scan(item)}
        ></Infra>
      ))}
    </div>
  );
  return observer(InfraListView);
};

export default function (context) {
  const { rest, tr, history, alertStack, emitter } = context;
  const asyncOpCreate = AsyncOp(context);
  const Alert = alert(context);

  function Routes(stores) {
    return [
      {
        path: "",
        protected: true,
        action: (routerContext) => {
          stores.infra.get();
          return {
            routerContext,
            title: "My Infra",
            component: h(createInfraList(context), {
              title: "Create",
              store: stores.infra,
            }),
          };
        },
      },
      {
        path: "/create",
        protected: true,
        action: (routerContext) => {
          stores.create.setData({});
          return {
            routerContext,
            title: "Create New Infrastructure",
            component: h(createInfraNew(context), {
              title: "Create",
              buttonTitle: "Create Infrastructure",
              store: stores.create,
              onClick: () => stores.create.create(),
            }),
          };
        },
      },
      {
        path: "/edit",
        protected: true,
        action: (routerContext) => {
          stores.create.setData(window.history.state.usr);
          return {
            routerContext,
            title: "Edit Infrastructure",
            component: h(createInfraNew(context), {
              title: "Edit Infrastructure",
              buttonTitle: "Save Infrastructure",
              store: stores.create,
              onClick: () => stores.create.update(),
            }),
          };
        },
      },
    ];
  }

  function Stores() {
    const infraStore = observable({
      errors: {},
      opGet: asyncOpCreate(() => rest.get("infra")),
      get: action(async function () {
        const response = await this.opGet.fetch();
        runInAction(() => {
          forEach((infra) =>
            infraStore.scanMap.set(
              infra.id,
              asyncOpCreate(async (infraItem) => {
                await rest.post(`cloudDiagram`, { infra_id: infraItem.id });
                await infraStore.get();
              })
            )
          )(response);
        });
        console.log(response);
      }),
      opUpdate: asyncOpCreate((payload) => rest.patch("infra", payload)),
      update: action(async function () {
        this.errors = {};
        const response = await this.opUpdate.fetch(payload);
      }),
      scanMap: observable.map(),
      scan: action(async (infraItem) => {
        const opScan = infraStore.scanMap.get(infraItem.id);
        await opScan.fetch(infraItem);
      }),
    });

    const storeCreate = observable({
      data: {
        name: "",
        accessKeyId: "",
        secretKey: "",
        region: "us-east-1",
      },
      errors: {},
      setData: action((data) => {
        storeCreate.data = data;
      }),
      op: asyncOpCreate((payload) => rest.post("infra", payload)),
      create: action(async function () {
        storeCreate.errors = {};
        const { data } = storeCreate;
        const payload = {
          name: data.name,
          providerType: "aws",
          providerAuth: {
            AWSAccessKeyId: data.accessKeyId.trim(),
            AWSSecretKey: data.secretKey,
            region: data.region,
          },
        };

        try {
          const result = await this.op.fetch(payload);
          alertStack.add(
            <Alert.Info message={tr.t("Infrastructure Created")} />
          );
          history.push("/user/infra");
          emitter.emit("infra.created", result);
        } catch (errors) {
          alertStack.add(
            <Alert.Error message={tr.t("Error creating infrastructure")} />
          );
        }
      }),
    });
    return {
      infra: infraStore,
      create: storeCreate,
    };
  }

  const stores = Stores(context);

  return {
    stores: () => stores,
    routes: () => Routes(stores),
  };
}
