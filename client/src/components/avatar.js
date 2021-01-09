/* @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import styled from "@emotion/styled";

export default function createAvatar() {
  const store = observable({
    loading: true,
    error: false,
    onLoad() {
      store.loading = false;
    },
    onError() {
      store.loading = false;
      store.error = true;
    },
  });

  const AvatarView = styled("div")(
    {
      margin: 0,
    },
    ({ width, height, circle }) => ({
      width,
      height,
    }),
    ({ circle }) =>
      circle && {
        "> img": {
          borderRadius: "50%",
        },
      }
  );

  const Avatar = observer(
    ({ src, width = 50, height = 50, alt = "", circle, ...props }) => (
      <AvatarView circle={circle} width={width} height={height} {...props}>
        {store.loading && ""}
        {store.error && "ERROR"}
        {!store.error && (
          <img
            alt={alt}
            src={src}
            width={width}
            height={height}
            onLoad={() => store.onLoad()}
            onError={(e) => store.onError(e)}
          />
        )}
      </AvatarView>
    )
  );

  return Avatar;
}
