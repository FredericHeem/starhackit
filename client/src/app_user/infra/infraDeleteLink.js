/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { toJS } from "mobx";
import { observer } from "mobx-react";

export const infraDeleteLink = ({ history }) =>
  observer(({ store, infraSettingsStore }) => (
    <p>
      {/* <pre
        css={css`
          width: 300px;
        `}
      >
        {JSON.stringify(infraSettingsStore.data, null, 4)}
      </pre> */}
      <a
        data-infra-edit-delete-link
        css={css`
          color: red;
          cursor: pointer;
          text-decoration: underline;
        `}
        onClick={() => {
          history.push(`/infra/detail/${store.id}/delete`, {
            id: store.id,
            ...toJS(infraSettingsStore.data),
          });
        }}
      >
        Danger zone...
      </a>
    </p>
  ));
