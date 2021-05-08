/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

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

export default createForm;
