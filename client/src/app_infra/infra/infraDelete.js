/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observer } from "mobx-react";

import button from "mdlean/lib/button";
import formGroup from "mdlean/lib/formGroup";
import input from "mdlean/lib/input";

import createForm from "components/form";

export const createInfraDelete = (context) => {
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
      {/* <pre
        css={css`
          width: 300px;
        `}
      >
        {JSON.stringify(store, null, 4)}
      </pre> */}
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
