/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const createResourcePerTypeTable =
  ({ theme }) =>
  ({ lives }) =>
    (
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

export default createResourcePerTypeTable;
