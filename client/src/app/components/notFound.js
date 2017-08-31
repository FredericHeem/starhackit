import * as React from "react";
import glamorous from "glamorous";

export default context => {
  const { tr } = context;

  const NotFoundView = glamorous("div")({
    margin: 20
  });

  return function NotFound() {
    return (
      <NotFoundView>
        <h1>{tr.t("Page Not Found")}</h1>
        <h1>{tr.t("404")}</h1>
        <p>{tr.t("We cannot found the page we were looking for")}</p>
      </NotFoundView>
    );
  };
};
