/** @jsx jsx */
import { useEffect } from "react";
import { jsx, css } from "@emotion/core";
import { observer } from "mobx-react";
import AsyncOp from "utils/asyncOp";

export default context => {
  const { history, rest } = context;
  const meStore = AsyncOp(context)(() => rest.get(`me`));

  const UserDetails = observer(() => {
    useEffect(() => {
      meStore.fetch();
    }, []);

    return (
      <span onClick={() => history.push("settings")}>
        {meStore.data ? meStore.data.email : "Loading"}
      </span>
    );
  });

  const UserInfo = observer(() => (
    <div
      css={css`
        margin-left: 0px;
      `}
    >
      <UserDetails />
    </div>
  ));

  return UserInfo;
};
