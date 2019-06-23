import * as React from "react";
import styled from "@emotion/styled";

export default context => {
  const { palette } = context;
  const IconView = styled("i")({
    color: palette.textColor
  });

  return function FontIcon({ className, style, color }) {
    return <IconView css={style} color={color} className={className} />;
  };
};
