import React from "react";
import { observable } from "mobx";
import { observer} from 'mobx-react';
import glamorous from "glamorous";
import { SketchPicker } from "react-color";
import deepForceUpdate from 'react-deep-force-update';


export default context => {
  const { theme } = context;
  const { palette } = theme;
  //console.log("theme primary", palette.primary);

  const store = observable({
    showPicker: false
  });
  const ColorListView = glamorous("div")({
    width: 250
  });

  const ColorRowView = glamorous("div")({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    margin: 10,
    cursor: "pointer"
  });

  const Color = glamorous('div')({
    height: 40,
    width: 40,
    background: 'black'
  });
  function onSelectColor(event) {
    console.log("onSelectColor ", event.hex);
    palette[store.colorName] = event.hex;
    deepForceUpdate(context.rootInstance);
    store.showPicker = false;
  }
  function onShowPicker(colorName) {
    console.log("onShowPicker ", colorName);
    store.showPicker = true;
    store.colorName = colorName
  }
  function ColorRow({ colorName }) {
    return (
      <ColorRowView onClick={() => onShowPicker(colorName)}>
        <strong>{colorName}</strong>

        <Color css={{background: palette[colorName]}} />
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
    console.log("ThemeView: ", theme);
    return (
      <div className="theme-view">
        <ColorListView>
          {store.showPicker &&
            <SketchPicker
              color={store.colorValue}
              onChange={event => onSelectColor(event)}
            />}
          {colors.map((color, key) => <ColorRow colorName={color} key={key} />)}
        </ColorListView>
      </div>
    );
  }
  return observer(ThemeView);
};
