/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { get, eq, pipe, flatMap, fork, switchCase, pick, tap } from "rubico";
import { size, isEmpty } from "rubico/x";
import { MdEdit } from "react-icons/md";
import formatDistance from "date-fns/formatDistance";

import button from "mdlean/lib/button";

import createForm from "components/form";
import spinner from "mdlean/lib/spinner";
import screenLoader from "components/screenLoader";

import badgeRegion from "./badgeRegion";
import providerLogo from "./providerLogo";
import createResourcePerTypeTable from "./resourceTable";

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
              const state = {
                id: detail.id,
                name: detail.name,
                providerType: detail.providerType,
                providerName: detail.providerName,
                providerAuth: {
                  ...detail.providerAuth,
                  credentials: { ...detail.providerAuth?.credentials },
                },
              };
              history.push(
                `${detail.id}/${
                  detail.providerName || detail.providerType
                }/edit`,
                state
              );
            }}
          />
        </header>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <ProviderLogo name={detail.providerName || detail.providerType} />
          {detail.providerAuth?.AWS_REGION && (
            <BadgeRegion region={detail.providerAuth.AWS_REGION} />
          )}
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
            visibility={store.opScan.loading}
            color={palette.primary.main}
          />
        </div>
        <ScanLastUpdated updatedAt={get("Jobs[0].updatedAt")(detail)} />
        <div
          css={css`
            margin: 1rem 0rem 1rem 0rem;
          `}
        >
          {detail.gitRepository && (
            <Button
              target="_blank"
              href={detail.gitRepository.url}
              label="Open GitHub"
            />
          )}
        </div>
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

export default createInfraDetail;
