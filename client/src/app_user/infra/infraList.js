/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { get, eq, pipe, flatMap, fork, switchCase, pick, tap } from "rubico";
import { size, isEmpty } from "rubico/x";

import button from "mdlean/lib/button";

import createForm from "components/form";
import page from "components/Page";
import screenLoader from "components/screenLoader";
import badgeRegion from "./badgeRegion";
import providerLogo from "./providerLogo";

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
        data-infra-list-item-name={item.name}
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
        <ProviderLogo name={item.providerName || item.providerType} />
        {item.providerAuth.AWS_REGION && (
          <BadgeRegion region={item.providerAuth.AWS_REGION} />
        )}
      </li>
    );
  };
  return observer(InfraItem);
};

export const createInfraList = (context) => {
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
