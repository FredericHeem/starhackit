/* @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { observer } from "mobx-react";

import input from "mdlean/lib/input";
import button from "mdlean/lib/button";

import paper from "components/Paper";
import form from "components/Form";
import formGroup from "components/FormGroup";

export default (context) => {
  const { tr, history } = context;
  const FormGroup = formGroup(context);
  const Paper = paper(context);
  const Form = form(context);
  const Button = button(context, {
    cssOverride: css`
      width: 256px;
    `,
  });

  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 256px;
      }
    `,
  });

  return observer(function UserDeleteForm({ store }) {
    return (
      <Form>
        <header>
          <h3>{tr.t("Delete My Account")}</h3>
        </header>
        <main>
          <div>
            To prevent accidental deletion, please type 'delete' in the input
            field:
          </div>
          <FormGroup data-delete-name>
            <Input
              data-delete-name
              value={store.input}
              onChange={(e) => {
                store.setInput(e.target.value);
              }}
              label={tr.t(`Type delete`)}
            />
          </FormGroup>
        </main>
        <footer>
          <Button
            data-user-button-delete
            primary
            raised
            disabled={!store.nameMatch}
            onClick={() => store.destroy()}
            label={tr.t("Delete Account")}
          />
          <Button onClick={() => history.back()} label={tr.t("Cancel")} />
        </footer>
      </Form>
    );
  });
};
