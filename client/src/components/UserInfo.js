/* @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { jsx, css } from "@emotion/react";
import { observer } from "mobx-react";
import button from "mdlean/lib/button";
import AsyncOp from "utils/asyncOp";
import avatar from "./avatar";

export default (context) => {
  const { rest } = context;
  const meStore = AsyncOp(context)(() => rest.get(`me`));
  const Avatar = avatar(context);
  const Button = button(context);

  const UserDetails = observer(() => (
    <Button raised primary>
      {meStore.data.picture ? (
        <Avatar
          title={meStore.data.email}
          alt={meStore.data.email}
          src={meStore.data.picture.url}
        />
      ) : (
        <span>{meStore.data.email}</span>
      )}
    </Button>
  ));

  const UserInfo = observer(() => {
    useEffect(() => {
      meStore.fetch();
    }, []);
    return (
      <div
        css={css`
          margin-left: 0px;
          margin-right: 10px;
        `}
      >
        {meStore.data ? <UserDetails /> : "Loading"}
      </div>
    );
  });

  return UserInfo;
};
