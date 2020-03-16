import React, { createElement as h } from "react";
import createAsyncRoute from "components/AsyncRoute";
import spinner from "components/spinner";

export default context => {
  const { theme: {palette}, tr } = context;
  const AsyncRoute = createAsyncRoute(context);
  return function AsyncView({ getModule, ...rest }) {
    return (
      <AsyncRoute
        {...rest}
        getComponent={(resolve, reject) =>
          getModule()
            .then(module => {resolve(module.default(context))})
            .catch(reject)
        }
        loading={() => (
          <div>{h(spinner(context), { size: 400, color: palette.primary.main })}</div>
        )}
        error={error => (
          <div>
            <h3>{tr.t("Error loading component")}</h3>
            <p>{error && error.toString()}</p>
          </div>
        )}
      />
    );
  };
};
