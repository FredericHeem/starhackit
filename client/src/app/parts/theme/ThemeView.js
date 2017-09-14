import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import glamorous from "glamorous";
import ColorPicker from "react-color/lib/components/photoshop/Photoshop";
import deepForceUpdate from "preact-deep-force-update";

export default context => {
  const { theme } = context;
  const { palette } = theme;
  //console.log("theme primary", palette.primary);

  const store = observable({
    showPicker: false,
    colorValue: "",
    colorName: ""
  });
  const ColorListView = glamorous("div")({
    width: 300
  });

  const ColorRowView = glamorous("div")({
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    margin: 10,
    cursor: "pointer",
    border: `1px dotted grey`
  });
  const ColorTextView = glamorous("div")({
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    margin: 10,
    cursor: "pointer"
  });
  const Color = glamorous("div")({
    height: 40,
    width: 40,
    margin: 6,
    background: "black"
  });

  function onChangeColor(event) {
    console.log("onChangeColor ", event.hex);
    palette[store.colorName] = event.hex;
    setTimeout(() => deepForceUpdate(context.rootInstance), 1);
  }
  function onAcceptColor(event) {
    console.log("onAcceptColor ", event.hex);
    store.showPicker = false;
  }
  function onShowPicker(colorName) {
    console.log("onShowPicker ", colorName);
    store.colorName = colorName;
    store.colorValue = palette[colorName];
    store.showPicker = true;
  }

  function onCancelColor() {
    store.showPicker = false;
  }
  function ColorRow({ colorName }) {
    return (
      <ColorRowView onClick={() => onShowPicker(colorName)}>
        <Color css={{ background: palette[colorName] }} />
        <strong>{colorName}</strong>
      </ColorRowView>
    );
  }
  function ColorGroupLightDark({ colorName, display }) {
    return (
      <ColorRowView onClick={() => onShowPicker(colorName)}>
        <Color css={{ background: palette[`${colorName}Dark`] }} />
        <Color css={{ background: palette[colorName] }} />
        <Color css={{ background: palette[`${colorName}Light`] }} />
        <strong>{display}</strong>
      </ColorRowView>
    );
  }
  const ColorGroupTextView = glamorous("div")({
    flex: 1,
    flexDirection: "column",
    border: `1px dotted grey`,
    margin: 10
  });

  function ColorGroupText({ colorName, display }) {
    console.log("ColorGroupText ", colorName, display);
    return (
      <ColorGroupTextView>
        <ColorTextView onClick={() => onShowPicker(colorName)}>
          <Color css={{ background: palette[colorName] }} />
          <strong>{display}</strong>
        </ColorTextView>
        <ColorTextView onClick={() => onShowPicker(`${colorName}OnPrimary`)}>
          <Color
            title={`${colorName}OnPrimary`}
            css={{ background: palette[`${colorName}OnPrimary`] }}
          />
          <strong>{`${display} On Primary`}</strong>
        </ColorTextView>
        <ColorTextView onClick={() => onShowPicker(`${colorName}OnSecondary`)}>
          <Color
            title={`${colorName}OnSecondary`}
            css={{ background: palette[`${colorName}OnSecondary`] }}
          />
          <strong>{`${display} On Secondary`}</strong>
        </ColorTextView>
      </ColorGroupTextView>
    );
  }
  const colors = ["background", "borderColor"];

  function ThemeView() {
    //console.log("ThemeView: ", theme, store.colorValue);
    //console.log("ThemeView: colorValue ", store.colorValue);
    return (
      <div className="theme-view">
        {store.showPicker && (
          <ColorPicker
            color={store.colorValue}
            header={store.colorName}
            onChange={event => onChangeColor(event)}
            onAccept={event => onAcceptColor(event)}
            onCancel={event => onCancelColor(event)}
          />
        )}
        <ColorGroupLightDark colorName="primary" display="Primary" />
        <ColorGroupLightDark colorName="accent" display="Accent" />
        <ColorGroupText colorName="textPrimary" display="Text Primary" />
        <ColorGroupText colorName="textSecondary" display="Text Secondary" />
        <ColorListView>
          {colors.map((color, key) => <ColorRow colorName={color} key={key} />)}
        </ColorListView>
      </div>
    );
  }
  return observer(ThemeView);
};
