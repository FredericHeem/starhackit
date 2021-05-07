/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action, runInAction, toJS } from "mobx";
import { createElement as h } from "react";
import { observer } from "mobx-react";
import { get, eq, pipe, flatMap, fork, switchCase, pick, tap } from "rubico";
import { size, isEmpty, pluck } from "rubico/x";
import { MdEdit } from "react-icons/md";
import formatDistance from "date-fns/formatDistance";
import button from "mdlean/lib/button";
import alertAjax from "components/alertAjax";
import formGroup from "components/FormGroup";
import input from "mdlean/lib/input";

import validate from "validate.js";
import rules from "./rulesForm";
import awsSelectRegion from "./awsSelectRegion";

import AsyncOp from "utils/asyncOp";
import alert from "components/alert";
import page from "components/Page";
import spinner from "components/spinner";
import AwsLogo from "./assets/aws.svg";

const getLivesFromJob = get("result.list.result.results[0].results");

const resourceStats = pipe([
  getLivesFromJob,
  fork({ types: size, resources: pipe([flatMap(get("resources")), size]) }),
  tap((xx) => {}),
]);

const screenLoader = (context) => {
  const {
    tr,
    theme: { palette },
  } = context;
  const Spinner = spinner(context);
  return ({ loading, message = tr.t("Loading...") }) => (
    <div
      css={css`
        position: fixed;
        width: 100vw;
        top: 0;
        left: 0;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${palette.grey[100]};
        transition: opacity 0.3s ease-in-out;
        opacity: ${loading ? 0.9 : 0};
        z-index: ${loading ? 3 : -3};
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 600;
        `}
      >
        <span>{message}</span>
        <Spinner />
      </div>
    </div>
  );
};

const createForm = ({ theme }) => ({ children, cssOverride, ...other }) => (
  <form
    {...other}
    onSubmit={(e) => e.preventDefault()}
    css={[
      css`
        box-shadow: ${theme.shadows[1]};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0rem 1rem;
        margin-bottom: 2rem;

        header {
          border-bottom: 1px solid ${theme.palette.grey[400]};
          padding-top: 1rem;
          margin-bottom: 1rem;
          button {
            margin-right: 10px;
          }
        }
        main {
          flex-grow: 1;
          margin: 1rem 0;
        }
        footer {
          border-top: 1px solid ${theme.palette.grey[400]};
          padding: 1rem 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          button {
            margin-right: 10px;
          }
        }
      `,
      cssOverride,
    ]}
  >
    {children}
  </form>
);

const badgeRegion = ({ theme: { palette } }) => ({ region }) => (
  <div
    css={css`
      display: inline-block;
      border: 2px solid ${palette.grey[400]};
      border-radius: 5px;
      color: ${palette.grey[500]};
      padding: 0.5rem;
      //margin: 0.5rem;
      max-height: 1.2rem;
    `}
  >
    {region}
  </div>
);

const providerType2Logo = (type) =>
  switchCase([
    eq(type, "aws"),
    () => AwsLogo,
    (type) => {
      throw Error(`invalid type '${type}'`);
    },
  ])();

const providerLogo = ({ theme: { palette } }) => ({ type }) => (
  <img
    css={css`
      filter: grayscale(100%);
    `}
    width="60px"
    src={providerType2Logo(type)}
  ></img>
);

const createResourcePerTypeTable = ({ theme }) => ({ lives }) => (
  <table
    css={css`
      box-shadow: ${theme.shadows[1]};
      min-width: 200px;
      border-collapse: collapse;
      border-top: 0.5em solid transparent;
      border-spacing: 0;
      padding: 16px;
      & td,
      & th {
        padding: 0.6rem 1rem 0.6rem 1rem;
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
  const { tr, history, rest, theme } = context;

  const { palette } = theme;
  const BadgeRegion = badgeRegion(context);
  const ProviderLogo = providerLogo(context);
  const Button = button(context, {
    cssOverride: css``,
  });

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
        > div {
        }
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
        onClick={() => {
          onClick(item);
        }}
      >
        <ProjectName name={item.name} />
        {item.Jobs[0] && <ResourceStat stats={resourceStats(item.Jobs[0])} />}
        <ProviderLogo type="aws" />
        <BadgeRegion region={item.providerAuth.AWSRegion} />
      </li>
    );
  };
  return observer(InfraItem);
};

const createInfraDelete = (context) => {
  const { tr, history } = context;
  const Form = createForm(context);
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 300px;
      }
    `,
  });
  const Button = button(context, {
    cssOverride: css``,
  });

  const InfraDeleteForm = ({ store }) => (
    <Form data-infra-delete>
      <header>
        <h2>Delete Infrastructure</h2>
      </header>
      <main>
        <div>
          To prevent accidental deletion, please type the name of the
          infrastructure to destroy:
          <pre
            css={css`
              color: red;
            `}
          >
            {store.data.name}
          </pre>
        </div>
        <FormGroup data-delete-name>
          <Input
            data-delete-name
            value={store.name}
            onChange={(e) => {
              store.setName(e.target.value);
            }}
            label={tr.t(`Type ${store.data.name}`)}
            error={store.errors.name && store.errors.name[0]}
          />
        </FormGroup>
      </main>
      <footer>
        <Button
          data-infra-button-delete
          primary
          raised
          disabled={!store.nameMatch}
          onClick={() => store.destroy({})}
          label={tr.t("Delete Infrastructure")}
        />
        <Button onClick={() => history.back()} label={tr.t("Cancel")} />
      </footer>
    </Form>
  );
  return observer(InfraDeleteForm);
};

const createInfraNew = (context) => {
  const {
    tr,
    history,
    theme: { palette },
  } = context;
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
  ///const AlertAjax = alertAjax(context);
  const Button = button(context, {
    cssOverride: css``,
  });

  const InfraNew = ({ store }) => (
    <Form data-infra-create>
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
        <Button
          onClick={() => history.push(`/user/infra`)}
          label={tr.t("Cancel")}
        />
      </footer>
    </Form>
  );
  return observer(InfraNew);
};

const createInfraEdit = (context) => {
  const { tr, history } = context;
  const Form = createForm(context);
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
  const Button = button(context, {
    cssOverride: css``,
  });

  const InfraDelete = observer(({ store }) => (
    <p>
      <a
        data-infra-edit-delete-link
        css={css`
          color: red;
          cursor: pointer;
          text-decoration: underline;
        `}
        onClick={() => {
          history.push(`delete`, toJS(store.data));
        }}
      >
        Danger zone...
      </a>
    </p>
  ));

  const InfraEdit = ({ store }) => (
    <Form data-infra-edit>
      <header>
        <h2>Edit the Infrastructure</h2>
      </header>
      <main>
        <div>Edit the Infrastructure such as the name.</div>
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
            disabled
            value={store.data.accessKeyId}
            label={tr.t("AWS Access Key")}
          />
        </FormGroup>
        <FormGroup className="secret-key">
          <Input
            disabled
            value={store.data.secretKey}
            label={tr.t("AWS Secret Key")}
            type="password"
          />
        </FormGroup>
        <AwsSelectRegion
          disabled
          placeholder="Select a region"
          value={store.data.region}
          onSelected={(item) => {
            store.data.region = item;
          }}
        />
      </main>
      <footer
        css={css`
          button {
            margin-right: 10px;
          }
        `}
      >
        <Button
          primary
          raised
          onClick={() => store.update()}
          label={tr.t("Update Infrastructure")}
        />
        <Button onClick={() => history.back()} label={tr.t("Cancel")} />
      </footer>
      <InfraDelete store={store} />
    </Form>
  );
  return observer(InfraEdit);
};

const createInfraDetail = (context) => {
  const {
    tr,
    history,
    theme: { palette },
  } = context;
  const Form = createForm(context);
  const BadgeRegion = badgeRegion(context);
  const ProviderLogo = providerLogo(context);
  const Spinner = spinner(context);
  const Button = button(context, {
    cssOverride: css``,
  });
  const ResourcePerTypeTable = createResourcePerTypeTable(context);
  const ScreenLoader = screenLoader(context);
  const InfraDetailContainer = observer(({ store }) => (
    <div>
      {store.opGetById.data ? (
        <InfraDetail store={store} detail={store.opGetById.data} />
      ) : null}
      <ScreenLoader loading={store.opGetById.loading} />
    </div>
  ));
  const ScanLastUpdated = ({ updatedAt }) => (
    <div
      title={updatedAt}
      css={css`
        color: ${palette.grey[500]};
        > div {
          margin: 0.4rem 0;
        }
      `}
    >
      <div
        css={css`
          font-weight: 700;
          font-size: 0.7rem;
          text-transform: uppercase;
        `}
      >
        Last Scan
      </div>
      <div
        css={css`
          font-weight: 500;
          font-size: 0.9rem;
        `}
      >{`${
        updatedAt && formatDistance(new Date(updatedAt), new Date())
      } ago`}</div>
    </div>
  );
  const InfraDetail = observer(({ store, detail }) => (
    <Form
      data-infra-detail
      cssOverride={css`
        width: 100%;
        display: flex;
        flex-direction: row;
      `}
    >
      <section
        css={css`
          margin-right: 1rem;
        `}
      >
        <header
          css={css`
            display: flex;
            flex-direction: row;
          `}
        >
          <h2>{detail.name}</h2>
          <Button
            data-infra-edit-button
            icon={<MdEdit size="1.5rem" />}
            onClick={() => {
              history.push(`${detail.id}/edit`, {
                name: detail.name,
                id: detail.id,
                region: detail.providerAuth.AWSRegion,
                accessKeyId: detail.providerAuth.AWSAccessKeyId,
                secretKey: detail.providerAuth.AWSSecretKey,
              });
            }}
          />
        </header>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <ProviderLogo type="aws" />
          <BadgeRegion region={detail.providerAuth.AWSRegion} />
        </div>
        <div
          css={css`
            margin: 1rem 0rem 1rem 0rem;
            display: flex;
            flex-direction: row;
            align-items: center;
          `}
        >
          <Button
            primary
            raised
            onClick={() => store.scan(detail)}
            disabled={store.opScan.loading}
            label={store.opScan.loading ? tr.t("Scanning") : tr.t("New Scan")}
          />
          <Spinner
            css={css`
              visibility: ${store.opScan.loading ? "visible" : "hidden"};
            `}
            color={palette.primary.main}
          />
        </div>
        <ScanLastUpdated updatedAt={get("Jobs[0].updatedAt")(detail)} />

        {store.lives && <ResourcePerTypeTable lives={store.lives} />}
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
            __html: store.svg,
          }}
        />
      </section>
    </Form>
  ));

  return InfraDetailContainer;
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
          onClick={() => history.push(`infra/create`)}
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
                history.push(`/user/infra/detail/${item.id}`, toJS(item));
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
        path: "/detail/:id/edit",
        protected: true,
        action: (routerContext) => {
          stores.edit.setData(window.history.state.usr);
          return {
            routerContext,
            title: "Edit Infrastructure",
            component: h(createInfraEdit(context), {
              store: stores.edit,
              onClick: () => stores.create.update(),
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
        action: (routerContext) => {
          stores.infraDetail.getById(routerContext.params.id);

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
            AWSRegion: data.region,
          },
        };
        try {
          const result = await storeCreate.op.fetch(payload);
          await storeCreate.opScan.fetch(result);
          alertStack.add(
            <Alert.Info message={tr.t("Infrastructure Created")} />
          );
          history.push(`/user/infra/detail/${result.id}`, result);
          emitter.emit("infra.created", result);
        } catch (errors) {
          console.log(errors);

          // backend should 422 if the credentials are incorrect

          alertStack.add(
            <Alert.Danger
              data-alert-error-create
              message={tr.t(
                "Error creating infrastructure, check the credentials"
              )}
            />
          );
        }
      }),
    });

    const storeEdit = observable({
      data: defaultData,
      errors: {},
      reset: action(() => {
        storeEdit.data = defaultData;
      }),
      setData: action((data) => {
        storeEdit.data = data;
      }),
      opUpdate: asyncOpCreate((payload) =>
        rest.patch(`infra/${storeEdit.data.id}`, payload)
      ),
      update: action(async function () {
        this.errors = {};

        try {
          const response = await this.opUpdate.fetch(
            pick(["name"])(storeEdit.data)
          );
          console.log(response);
          alertStack.add(
            <Alert.Info message={tr.t("Infrastructure Updated")} />
          );
          history.back();
          emitter.emit("infra.updated", storeEdit.data);
        } catch (error) {
          console.error(error);
          alertStack.add(
            <Alert.Danger
              message={tr.t(
                "An error occured while updating the infrastructure"
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
            <Alert.Info message={tr.t("Infrastructure Deleted")} />
          );
          history.push("/user/infra");
          emitter.emit("infra.deleted", storeDelete.data);
        } catch (error) {
          console.error(error);
          alertStack.add(
            <Alert.Danger
              message={tr.t(
                "An error occured while destroying the infrastructure"
              )}
            />
          );
        }
      }),
    });

    return {
      infra: infraStore,
      create: storeCreate,
      edit: storeEdit,
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
