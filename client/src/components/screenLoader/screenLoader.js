/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import spinner from "components/spinner";

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

export default screenLoader;
