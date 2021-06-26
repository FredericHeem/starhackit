/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { get, or, pipe } from "rubico";
import { isEmpty } from "rubico/x";

import button from "mdlean/lib/button";
import spinner from "mdlean/lib/spinner";
import { infraDeleteLink } from "./infraDeleteLink";
import { buttonWizardBack, buttonHistoryBack } from "./wizardCreate";

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
            data: store.buildPayload(),
          })
        }
        label={tr.t("Create Infrastructure")}
      />
      <Spinner
        css={css`
          visibility: ${store.core.isCreating ? "visible" : "hidden"};
        `}
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

  return observer(({ store }) => (
    <>
      <footer>
        <ButtonHistoryBack />
        <Button
          data-infra-update-submit
          primary
          raised
          disabled={store.core.isUpdating}
          onClick={() => store.core.update({ data: store.buildPayload() })}
          label={tr.t("Update Infrastructure")}
        />
        <Spinner
          css={css`
            visibility: ${store.core.isUpdating ? "visible" : "hidden"};
          `}
          color={palette.primary.main}
        />
      </footer>
      <InfraDeleteLink store={store.core} />
    </>
  ));
};
