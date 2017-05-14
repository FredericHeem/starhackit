import React from 'react';
import DocTitle from 'components/docTitle';
import glamorous from 'glamorous';
const { Div } = glamorous;

export default context => {
  const { tr, theme } = context;
  const { palette } = theme;
  const ColorListView = glamorous('div')({
    width: 400,
  });

  const ColorRowView = glamorous('div')({
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'stretch',
    alignItems: 'stretch',
    height: 60,
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
    'primary1Color',
    'primary2Color',
    'primary3Color',
    'accent1Color',
    'accent2Color',
    'accent3Color',
    'secondaryTextColor',
    'alternateTextColor',
    'borderColor',
    'canvasColor',
    'clockCircleColor',
    'disabledColor',
    'pickerHeaderColor',
    'textColor',
    'shadowColor',
  ];

  function ThemeView() {
    console.log('theme: ', theme);
    return (
      <div className="theme-view">
        <DocTitle title="Theme Editor" />
        <h1>{tr.t('Theme Editor')}</h1>
        <ColorListView>
          {colors.map((color, key) => <ColorRow colorName={color} key={key} />)}
        </ColorListView>
      </div>
    );
  }
  return ThemeView;
};
