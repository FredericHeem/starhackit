import React from "react";
import AsyncRoute from "preact-async-route";

export default context => {
  const { tr } = context;

  return function AsyncView({ getModule, ...rest }) {
    return (
      <AsyncRoute
        {...rest}
        getComponent={() => getModule().then(module => module.default(context))}
        loading={() =>
          (<div>
            {tr.t("Loading")}
          </div>)}
      />
    );
  };
};
