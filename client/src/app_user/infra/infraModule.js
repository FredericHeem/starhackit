/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action, runInAction, toJS } from "mobx";
import React, { createElement as h } from "react";
import button from "mdlean/lib/button";
import alertAjax from "components/alertAjax";
import formGroup from "components/FormGroup";
import input from "mdlean/lib/input";
import { observer } from "mobx-react";
import { get, pipe, map } from "rubico";
import { size, forEach } from "rubico/x";
import validate from "validate.js";
import rules from "./rulesForm";
import awsSelectRegion from "./awsSelectRegion";

import AsyncOp from "utils/asyncOp";
import alert from "components/alert";
import page from "components/Page";
import spinner from "components/spinner";
import AwsLogo from "./assets/aws.svg";

const createResourcePerTypeTable = (context) => ({ lives }) => (
  <table
    css={css`
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
      {lives &&
        lives.map((live) => (
          <tr key={live.type}>
            <td>{live.type}</td>
            <td>{live?.resources.length}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

const createInfraItem = (context) => {
  const {
    tr,
    history,
    rest,
    theme: { palette },
  } = context;
  const Button = button(context, {
    cssOverride: css``,
  });

  const InfraLive = ({ lives, svg }) => (
    <div
      css={css`
        //border: 1px solid blue;
        display: flex;
      `}
    >
      <span
        css={css`
          svg {
          }
        `}
        dangerouslySetInnerHTML={{
          __html: svg,
        }}
      />
    </div>
  );

  const InfraItem = ({ item, store, onClick }) => {
    return (
      <div
        css={css`
          box-shadow: 2px 2px 2px 2px grey;
          margin: 1rem;
          padding: 1rem;
          cursor: pointer;
        `}
        onClick={() => {
          onClick(item);
        }}
      >
        <header
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              * {
                margin: 1rem;
              }
            `}
          >
            <h2>{item.name}</h2>
            <img width="60px" src={AwsLogo}></img>
            <div
              css={css`
                border: 2px solid ${palette.grey[400]};
                border-radius: 5px;
                color: ${palette.grey[500]};
                padding: 0.5rem;
              `}
            >
              {item.providerAuth.region}
            </div>
          </div>
        </header>

        {item.Jobs[0] && (
          <InfraLive
            svg={get("Jobs[0].result.svg")(item)}
            lives={get("Jobs[0].result.list.result.results[0].results")(item)}
          />
        )}
      </div>
    );
  };
  return observer(InfraItem);
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
  const AwsSelectRegion = awsSelectRegion(context);
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
      <AwsSelectRegion
        placeholder="Select a region"
        value={store.data.region}
        onSelected={(item) => {
          store.data.region = item;
        }}
      />
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
const createInfraDetail = (context) => {
  const { tr, history } = context;
  const Spinner = spinner(context);
  const Button = button(context, {
    cssOverride: css``,
  });
  const ResourcePerTypeTable = createResourcePerTypeTable(context);

  const InfraDetail = ({ store, detail = {} }) => (
    <form
      onSubmit={(e) => e.preventDefault()}
      css={css`
        display: flex;
      `}
    >
      <section>
        <h2>{detail.name}</h2>
        <Button
          onClick={() => store.scan(detail)}
          icon={store.opScan.loading && <Spinner />}
          label={store.opScan.loading ? tr.t("Scanning...") : tr.t("New Scan")}
        />
        <Button
          primary
          onClick={() => {
            history.push("infra/edit", {
              name: detail.name,
              region: detail.providerAuth.region,
              accessKeyId: detail.providerAuth.AWSAccessKeyId,
              secretKey: detail.providerAuth.AWSSecretKey,
            });
          }}
          label={tr.t("Edit Settings")}
        />
        <ResourcePerTypeTable
          lives={get("Jobs[0].result.list.result.results[0].results")(detail)}
        />
      </section>
      <section
        css={css`
          display: flex;
        `}
      >
        <span
          css={css`
            svg {
              //height: 800px;
            }
          `}
          dangerouslySetInnerHTML={{
            __html: get("Jobs[0].result.svg")(detail),
          }}
        />
      </section>
    </form>
  );

  return observer(InfraDetail);
};

const createInfraList = (context) => {
  const { tr, history } = context;
  const Page = page(context);
  const Button = button(context, {
    cssOverride: css`
      width: 256px;
    `,
  });
  const InfraItem = createInfraItem(context);

  const InfraListView = ({ store }) => (
    <form
      onSubmit={(e) => e.preventDefault()}
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
        <InfraItem
          store={store}
          item={datum}
          key={key}
          onScan={(item) => store.scan(item)}
          onClick={(item) => {
            const state = { ...item };
            console.log(state);
            history.push(`/user/infra/detail/${item.id}`, toJS(item));
          }}
        ></InfraItem>
      ))}
    </form>
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
          stores.create.reset();
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
      {
        path: "/detail/:id",
        protected: true,
        action: (routerContext) => {
          //stores.create.setData(window.history.state.usr);
          return {
            routerContext,
            title: "Infrastructure Detail",
            component: h(createInfraDetail(context), {
              store: stores.infraDetail,
              detail: window.history.state.usr,
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
        console.log(response);
      }),
      opUpdate: asyncOpCreate((payload) => rest.patch("infra", payload)),
      update: action(async function () {
        this.errors = {};
        const response = await this.opUpdate.fetch(payload);
      }),
    });

    const defaultData = {
      name: "",
      accessKeyId: "",
      secretKey: "",
      region: "us-east-1",
    };

    const storeCreate = observable({
      data: defaultData,
      errors: {},
      reset: action(() => {
        storeCreate.data = defaultData;
      }),
      setData: action((data) => {
        storeCreate.data = data;
      }),
      op: asyncOpCreate((payload) => rest.post("infra", payload)),
      create: action(async () => {
        storeCreate.errors = {};
        const { data } = storeCreate;

        const constraints = {
          name: rules.infraName,
          accessKeyId: rules.accessKeyId,
          secretKey: rules.secretKey,
        };
        const vErrors = validate(data, constraints);
        if (vErrors) {
          storeCreate.errors = vErrors;
          return;
        }

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
          const result = await storeCreate.op.fetch(payload);
          alertStack.add(
            <Alert.Info message={tr.t("Infrastructure Created")} />
          );
          history.push("/user/infra");
          emitter.emit("infra.created", result);
        } catch (errors) {
          console.log(errors);
          alertStack.add(
            <Alert.Danger message={tr.t("Error creating infrastructure")} />
          );
        }
      }),
    });

    const infraDetailStore = observable({
      id: "",
      opScan: asyncOpCreate((infraItem) =>
        rest.post(`cloudDiagram`, { infra_id: infraItem.id })
      ),
      scan: action(async (infraItem) => {
        console.log("infraDetailStore scan", infraItem);
        await infraDetailStore.opScan.fetch(infraItem);
      }),
    });

    return {
      infra: infraStore,
      create: storeCreate,
      infraDetail: infraDetailStore,
    };
  }

  const stores = Stores(context);

  return {
    stores: () => stores,
    routes: () => Routes(stores),
  };
}
