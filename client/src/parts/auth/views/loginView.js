/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createElement as h } from "react";

import button from "mdlean/lib/button";
import paper from "components/Paper";
import strike from "components/Strike";
import page from "components/Page";
import localLoginForm from "../components/localLoginForm";
import mediaSigninButtons from "../components/mediaSigninButtons";

export default context => {
  const { tr, history } = context;
  const Paper = paper(context);
  const Page = page(context);
  const LocalLoginForm = localLoginForm(context);
  const MediaSigninButtons = mediaSigninButtons(context);
  return function LoginView(props) {
    const Button = button(context);
    return (
      <Page className="login-page">
        <Paper>
          <h2>{tr.t("Login")}</h2>
          <div>
            <LocalLoginForm {...props} />
            {h(strike(context))}
            <MediaSigninButtons />
            {h(strike(context))}
            <a
              css={{ cursor: "pointer" }}
              onClick={() => history.push(`forgot`)}
            >
              {tr.t("Forgot Password")}
            </a>
          </div>
        </Paper>
      </Page>
    );
  };
};
