/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { get, or, pipe } from "rubico";
import { isEmpty } from "rubico/x";
import createForm from "components/form";

import button from "mdlean/lib/button";
import spinner from "mdlean/lib/spinner";
import { infraDeleteLink } from "./infraDeleteLink";
import { buttonWizardBack, buttonHistoryBack } from "./wizardCreate";

export const providerFormCreate = (context) => {
  const Form = createForm(context);
  return ({ children }) => (
    <Form spellCheck="false" autoCapitalize="none" data-infra-create>
      {children}
    </Form>
  );
};

export const providerFormUpdate = (context) => {
  const Form = createForm(context);
  return ({ children }) => (
    <Form spellCheck="false" autoCapitalize="none" data-infra-update>
      {children}
    </Form>
  );
};

export const providerConfigCreateFooter = (context) => {
  const {
    tr,
    history,
    theme: { palette },
  } = context;

  const Spinner = spinner(context);
  const Button = button(context, {
    cssOverride: css``,
  });
  const ButtonWizardBack = buttonWizardBack(context);

  return observer(({ store }) => (
    <footer>
      <ButtonWizardBack />
      <Button
        data-button-submit
        primary
        raised
        disabled={store.core.isCreating || store.isDisabled}
        onClick={() =>
          store.core.create({
            data: store.buildPayload({ data: store.core.data }),
          })
        }
        label={tr.t("Create Infrastructure")}
      />
      <Spinner
        visibility={store.core.isCreating}
        color={palette.primary.main}
      />
    </footer>
  ));
};

export const providerConfigUpdateFooter = (context) => {
  const {
    tr,
    history,
    theme: { palette },
  } = context;

  const Spinner = spinner(context);
  const Button = button(context, {
    cssOverride: css``,
  });
  const ButtonHistoryBack = buttonHistoryBack(context);
  const InfraDeleteLink = infraDeleteLink(context);

  return observer(({ store, infraSettingsStore }) => (
    <>
      <footer>
        <ButtonHistoryBack />
        <Button
          data-infra-update-submit
          primary
          raised
          disabled={store.core.isUpdating}
          onClick={() =>
            store.core.update({
              data: store.buildPayload({ data: store.core.data }),
            })
          }
          label={tr.t("Update Infrastructure")}
        />
        <Spinner
          visibility={store.core.isUpdating}
          color={palette.primary.main}
        />
      </footer>
      <InfraDeleteLink
        store={store.core}
        infraSettingsStore={infraSettingsStore}
      />
    </>
  ));
};
