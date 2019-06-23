import React from "react";
import styled from "@emotion/styled";
import fontIcon from "components/FontIcon";

export default context => {
  const { palette } = context;
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

  const CardView = styled("div")(() => ({
    width: "150px",
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "150px",
    padding: 10,
    margin: 10,
    boxShadow: `2px 2px 2px 2px ${palette.borderColor}`
  }));

  const CardContainer = styled("div")({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center"
  });

  const CardItem = styled("div")({
    order: 0,
    flex: "0 1 auto",
    boxSizing: "border-box",
    maxWidth: "100%"
  });

  function Card({ title, text, icon, img, height, width }) {
    return (
      <CardView className="grow">
        <CardContainer>
          <CardItem>
            <h2>{title}</h2>
            <p>{text}</p>
          </CardItem>
          <CardItem>
            {icon && <MediaIcon icon={icon} />}
            {img && (
              <MediaImg title={title} img={img} height={height} width={width} />
            )}
          </CardItem>
        </CardContainer>
      </CardView>
    );
  }
  return Card;
};
