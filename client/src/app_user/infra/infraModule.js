/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action, toJS } from "mobx";
import { createElement as h } from "react";
import { observer } from "mobx-react";
import { get, eq, pipe, flatMap, fork, switchCase, pick, tap } from "rubico";
import { size, isEmpty } from "rubico/x";
import validate from "validate.js";

import button from "mdlean/lib/button";
import formGroup from "mdlean/lib/formGroup";
import input from "mdlean/lib/input";
import alert from "mdlean/lib/alert";
import AsyncOp from "mdlean/lib/utils/asyncOp";

import rules from "./rulesForm";

import createForm from "components/form";
import page from "components/Page";
import screenLoader from "components/screenLoader";
import wizardCreate from "./wizardCreate";
import badgeRegion from "./badgeRegion";
import providerLogo from "./providerLogo";
import createInfraDetail from "./infraDetail";
import { awsFormEdit, createStoreAws } from "./awsConfig";
import { gcpFormEdit, createStoreGoogle } from "./gcpConfig";
import { azureFormEdit, createStoreAzure } from "./azureConfig";
import { createInfraDelete } from "./infraDelete";

const getLivesFromJob = get("result.list.result.results[0].results");

const resourceStats = pipe([
  getLivesFromJob,
  fork({ types: size, resources: pipe([flatMap(get("resources")), size]) }),
  tap((xx) => {}),
]);

const createInfraItem = (context) => {
  const { tr, history, rest, theme } = context;

  const { palette } = theme;
  const BadgeRegion = badgeRegion(context);
  const ProviderLogo = providerLogo(context);
  const ResourceStat = ({ stats }) => (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        font-size: 1.3rem;
        font-weight: 600;
        > span {
          margin: 0.3rem;
        }
      `}
    >
      <Label title="Resources" />
      <div>{stats.resources}</div>
    </div>
  );

  const Label = ({ title }) => (
    <div
      css={css`
        font-size: 1rem;
        font-weight: 600;
        color: ${palette.grey[600]};
        margin-bottom: 0.6rem;
      `}
    >
      {title}
    </div>
  );
  const ProjectName = ({ name }) => (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        white-space: nowrap;
      `}
    >
      <Label title="Project Name" />
      <div
        css={css`
          font-size: 1.5rem;
          font-weight: 600;
        `}
      >
        {name}
      </div>
    </div>
  );
  const InfraItem = ({ item, store, onClick }) => {
    return (
      <li
        data-infra-list-item
        css={css`
          box-shadow: ${theme.shadows[1]};
          cursor: pointer;
          display: flex;
          align-items: center;
          > * {
            margin: 1rem;
          }
        `}
        onClick={(event) => {
          onClick(item);
        }}
      >
        <ProjectName name={item.name} />
        {item.Jobs[0] && <ResourceStat stats={resourceStats(item.Jobs[0])} />}
        <ProviderLogo type={item.providerType} />
        {item.providerAuth.AWS_REGION && (
          <BadgeRegion region={item.providerAuth.AWS_REGION} />
        )}
      </li>
    );
  };
  return observer(InfraItem);
};

const createInfraList = (context) => {
  const { tr, history } = context;
  const Form = createForm(context);
  const Page = page(context);
  const Button = button(context, {
    cssOverride: css`
      width: 256px;
    `,
  });
  const ScreenLoader = screenLoader(context);

  const InfraItem = createInfraItem(context);

  const InfraListView = observer(({ store, items }) => (
    <Form
      data-infra-list
      cssOverride={css`
        //border: 1px solid red;
        width: 95%;
      `}
    >
      <header
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          > h2 {
            margin-right: 2rem;
          }
        `}
      >
        <h2>Your Infrastructures</h2>
        <Button
          primary
          raised
          onClick={() => history.push(`/infra/create`)}
          label={tr.t("+ New Infrastructure")}
        />
      </header>
      <ul
        css={css`
          display: inline-grid;
          justify-content: space-around;
          align-items: center;
          > * {
            margin: 1rem;
          }
        `}
      >
        {Array.isArray(items) &&
          items.map((item) => (
            <InfraItem
              store={store}
              item={item}
              key={item.id}
              onScan={(item) => store.scan(item)}
              onClick={(item) => {
                history.push(`/infra/detail/${item.id}`);
              }}
            ></InfraItem>
          ))}
      </ul>
    </Form>
  ));

  const InfraListContainer = observer(({ store }) => (
    <div>
      {store.opGet.data && (
        <InfraListView store={store} items={store.opGet.data} />
      )}
      <ScreenLoader
        loading={store.opGet.loading}
        message={tr.t("Loading Infrastructures")}
      />
    </div>
  ));
  return InfraListContainer;
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
            component: h(wizardCreate(context), {
              title: "Create",
              buttonTitle: "Create Infrastructure",
              store: stores.create,
              //TODO check
              onClick: () => stores.create.create(),
            }),
          };
        },
      },
      {
        path: "/detail/:id/aws/edit",
        protected: true,
        action: async (routerContext) => {
          stores.aws.setData(window.history.state.usr);
          return {
            routerContext,
            title: "Edit Aws Infrastructure",
            component: h(awsFormEdit(context), {
              store: stores.aws,
            }),
          };
        },
      },
      {
        path: "/detail/:id/google/edit",
        protected: true,
        action: async (routerContext) => {
          stores.google.setData(window.history.state.usr);
          return {
            routerContext,
            title: "Edit GCP Infrastructure",
            component: h(gcpFormEdit(context), {
              store: stores.google,
            }),
          };
        },
      },
      {
        path: "/detail/:id/azure/edit",
        protected: true,
        action: async (routerContext) => {
          stores.azure.setData(window.history.state.usr);
          return {
            routerContext,
            title: "Edit Azure Infrastructure",
            component: h(azureFormEdit(context), {
              store: stores.azure,
            }),
          };
        },
      },
      {
        path: "/detail/:id/delete",
        protected: true,
        action: (routerContext) => {
          stores.delete.setData(window.history.state.usr);
          return {
            routerContext,
            title: "Delete Infrastructure",
            component: h(createInfraDelete(context), {
              store: stores.delete,
            }),
          };
        },
      },
      {
        path: "/detail/:id",
        protected: true,
        action: async (routerContext) => {
          await stores.infraDetail.getById(routerContext.params.id);
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
        if (isEmpty(response)) {
          context.history.push("infra/create");
        }
        console.log(response);
      }),
    });

    //TODO remove
    const defaultData = {
      name: "",
      accessKeyId: "",
      secretKey: "",
      region: "us-east-1",
    };

    //TODO remove
    const storeCreate = observable({
      data: defaultData,
      errors: {},
      reset: action(() => {
        storeCreate.data = defaultData;
      }),
      setData: action((data) => {
        storeCreate.data = data;
      }),
      opScan: asyncOpCreate((infraItem) =>
        rest.post(`cloudDiagram`, { infra_id: infraItem.id })
      ),
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
            AWS_REGION: data.region,
          },
        };
        try {
          const result = await storeCreate.op.fetch(payload);
          await storeCreate.opScan.fetch(result);
          alertStack.add(
            <Alert
              severity="success"
              message={tr.t("Infrastructure Created")}
            />
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

    const infraDetailStore = observable({
      id: "",
      lives: [],
      svg: "",
      opGetById: asyncOpCreate((id) => rest.get(`infra/${id}`)),
      getById: action(async (id) => {
        const infra = await infraDetailStore.opGetById.fetch(id);
        infraDetailStore.lives = getLivesFromJob(infra.Jobs[0]);
        infraDetailStore.svg = get("Jobs[0].result.svg")(infra);
      }),
      opScan: asyncOpCreate((infraItem) =>
        rest.post(`cloudDiagram`, { infra_id: infraItem.id })
      ),
      scan: action(async (infraItem) => {
        console.log("infraDetailStore scan", infraItem);
        await infraDetailStore.opScan.fetch(infraItem);
        await infraDetailStore.getById(infraItem.id);
      }),
    });

    const storeDelete = observable({
      name: "",
      setName: (name) => {
        storeDelete.name = name;
      },
      data: {},
      setData: (data) => {
        storeDelete.name = "";
        storeDelete.data = data;
      },
      errors: {},
      opDestroy: asyncOpCreate(() => rest.del(`infra/${storeDelete.data.id}`)),
      get nameMatch() {
        return (
          !isEmpty(storeDelete.name) &&
          storeDelete.name === storeDelete.data.name
        );
      },
      destroy: action(async () => {
        try {
          await storeDelete.opDestroy.fetch();

          alertStack.add(
            <Alert
              severity="success"
              message={tr.t("Infrastructure Deleted")}
            />
          );
          history.push("/infra");
          emitter.emit("infra.deleted", storeDelete.data);
        } catch (error) {
          console.error(error);
          alertStack.add(
            <Alert
              severity="error"
              message={tr.t(
                "An error occured while destroying the infrastructure"
              )}
            />
          );
        }
      }),
    });

    return {
      aws: createStoreAws(context),
      google: createStoreGoogle(context),
      azure: createStoreAzure(context),
      infra: infraStore,
      create: storeCreate,
      infraDetail: infraDetailStore,
      delete: storeDelete,
    };
  }

  const stores = Stores(context);

  return {
    stores: () => stores,
    routes: () => Routes(stores),
  };
}
