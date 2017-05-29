import React from "react";
import glamorous from "glamorous";

export default ({ theme } = context) => {
  const IconView = glamorous("i")({
    color: theme.palette.textColor
  });

  return function FontIcon({ className, style, color }) {
    return <IconView css={style} color={color} className={className} />;
  };
};
