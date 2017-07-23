import React from 'react';
import glamorous from 'glamorous';
import fontIcon from 'components/FontIcon';

export default (context) => {
  const { theme } = context;
  const { palette } = theme;
  const FontIcon = fontIcon(context);
  function MediaIcon({ icon }) {
    return (
      <div>
        <FontIcon className={icon} style={{ fontSize: 64 }} />
      </div>
    );
  }

  function MediaImg({ img, title, height, width }) {
    return (
      <div>
        <img src={img} alt={title} height={height} width={width} />
      </div>
    );
  }

  const CardView = glamorous('div')(() => ({
    width: '150',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: '150',
    padding: 10,
    margin: 10,
    boxShadow: `2px 2px 2px 2px ${palette.borderColor}`,
  }));

  const CardContainer = glamorous('div')({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    alignItems: 'center',
  });

  const CardItem = glamorous('div')({
    order: 0,
    flex: '0 1 auto',
    boxSizing: 'border-box',
    maxWidth: '100%',
  });

  function Card({ title, text, icon, img, height, width }) {
    return (
      <CardView className="grow">
        <CardContainer>
          <CardItem>
            <h2>{title}</h2><p>{text}</p>
          </CardItem>
          <CardItem>
            {icon && <MediaIcon icon={icon} />}
            {img && <MediaImg title={title} img={img} height={height} width={width} />}
          </CardItem>
        </CardContainer>
      </CardView>
    );
  }
  return Card;
};
