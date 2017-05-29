import React from "react";
import glamorous from "glamorous";
const { Div } = glamorous;

export default context => {
  const { theme } = context;
  const { palette } = theme;
  const ColorListView = glamorous("div")({
    width: 250
  });

  const ColorRowView = glamorous("div")({
    display: "flex",
    flexDirection: "row",
    alignContent: "stretch",
    alignItems: "stretch",
    height: 60,
    margin : 10
  });

  function ColorRow({ colorName }) {
    return (
      <ColorRowView>
        <Div
          flexGrow={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          border={`8px solid ${palette[colorName]}`}
        >
          {colorName}
        </Div>
        <Div
          width={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={palette[colorName]}
        >
          {palette[colorName]}
        </Div>
      </ColorRowView>
    );
  }

  const colors = [
    "primaryDark",
    "primary",
    "primaryLight",
    "accent",
    "background",
    "textPrimary",
    "textPrimaryOnPrimary",
    "textPrimaryOnAccent",
    "textSecondary",
    "borderColor"
  ];

  function ThemeView() {
    console.log("theme: ", theme);
    return (
      <div className="theme-view">
        <ColorListView>
          {colors.map((color, key) => <ColorRow colorName={color} key={key} />)}
        </ColorListView>
      </div>
    );
  }
  return ThemeView;
};
