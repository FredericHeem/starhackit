import React, { createElement as h } from "react";
import createAsyncRoute from "components/AsyncRoute";
import spinner from "components/spinner";

export default context => {
  const { palette } = context;
  const AsyncRoute = createAsyncRoute(context);
  return function AsyncView({ getModule, ...rest }) {
    return (
      <AsyncRoute
        {...rest}
        getComponent={() => getModule().then(module => module.default(context))}
        loading={() => (
          <div>
            {h(spinner(context), { size: 40, color: palette.primary })}
          </div>
        )}
      />
    );
  };
};
