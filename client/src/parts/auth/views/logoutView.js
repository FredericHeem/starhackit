import React, { createElement as h } from "react";
import { observer } from "mobx-react";
import page from "components/Page";
import paper from "components/Paper";
import button from "mdlean/lib/button";
import spinner from "mdlean/lib/spinner";

export default (context) => {
  const { tr } = context;
  const Page = page(context);
  const Paper = paper(context);
  const Button = button(context);
  function LoggingOut() {
    return (
      <Paper>
        <h1>{tr.t("Logging Out")}</h1>
        {h(spinner(context))}
      </Paper>
    );
  }
  function LoggedOut() {
    return (
      <Paper>
        <h1>{tr.t("Logged Out")}</h1>
        <p>{tr.t("Successfully logged out, see you soon.")}</p>
        <Button
          primary
          label={tr.t("Login")}
          onClick={() => window.location.replace("login")}
        />
      </Paper>
    );
  }
  return observer(function LogoutView({ store }) {
    return (
      <Page className="logout-page">
        {store.authenticated ? <LoggingOut /> : <LoggedOut />}
      </Page>
    );
  });
};
