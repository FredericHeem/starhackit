import React from "react";

export default context => {
  const Text = require("components/Text").default(context);
  return props => (
    <Text
      bold
      style={{
        marginTop: 4,
        marginBottom: 4,
        fontSize: 16,
      }}
      {...props}
    >
      {props.children}
    </Text>
  );
};
