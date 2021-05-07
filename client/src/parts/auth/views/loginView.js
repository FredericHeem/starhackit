/* @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import { createElement as h } from "react";

import button from "mdlean/lib/button";
import paper from "components/Paper";
import strike from "components/Strike";
import page from "components/Page";
import localLoginForm from "../components/localLoginForm";
import mediaSigninButtons from "../components/mediaSigninButtons";

export default (context) => {
  const {
    tr,
    config: { disableUsernamePasswordAuth },
  } = context;
  const Paper = paper(context);
  const Page = page(context);

  const LocalLoginForm = localLoginForm(context);
  const MediaSigninButtons = mediaSigninButtons(context);
  return function LoginView(props) {
    return (
      <Page className="login-page">
        <Paper>
          <img width="100px" src="/assets/cloud.svg"></img>
          <h2>{tr.t("Login to GruCloud")}</h2>

          <p>
            Sign in to GruCloud with one of the following authentication
            providers:
          </p>
          <div>
            {!disableUsernamePasswordAuth && <LocalLoginForm {...props} />}
            {h(strike(context))}
            <MediaSigninButtons />
          </div>
        </Paper>
      </Page>
    );
  };
};
