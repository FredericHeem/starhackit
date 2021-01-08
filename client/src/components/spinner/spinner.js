/* @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { jsx, keyframes } from "@emotion/react";

const animation = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const SvgView = styled("svg")({
  animation: `${animation} 4s linear infinite`,
});

export default () =>
  function Spinner({ size = 26, color = "black" }) {
    const radius = size / 2;
    return (
      <SvgView
        id="loader-1"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${radius / 2},${radius}`}
          strokeDashoffset="0"
          cx={radius}
          cy={radius}
          r={radius - 2}
        />
      </SvgView>
    );
  };
