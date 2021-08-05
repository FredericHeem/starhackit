import React, { createElement as h } from "react";
import styled from "@emotion/styled";

export default (context) => {
  const { tr, parts } = context;

  const ViewContainer = styled("div")({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  });

  const GuideView = styled("div")({
    //height: "100vh",
    display: "flex",
    margin: 20,
  });

  const Content = styled("div")({
    //flex: "1 1 auto",
    //overflow: "auto"
  });

  return function ComponentGuide() {
    //console.log("ComponentGuide")

    return (
      <GuideView>
        <Content>
          <h1>{tr.t("The component guide.")}</h1>
          <h3>
            {tr.t(
              "A showroom to display components and views with various properties"
            )}
          </h3>
          <h2>{tr.t("Components")}</h2>
          <ViewContainer>
            {h(buttons(context))}
            {h(inputs(context))}
          </ViewContainer>
          <h2>{tr.t("Authentication")}</h2>
          {/*<ViewContainer>
            {parts.auth
              .routes()
              .map(route => h("div", { key: route.path }, route.action({params: {}}).component)
              )}
            </ViewContainer>
          <h2>{tr.t("Profile")}</h2>
          <ViewContainer>
            {parts.profile
              .routes()
              .map(route => h("div", { key: route.path }, route.action({}).component)
              )}
          </ViewContainer>*/}
        </Content>
      </GuideView>
    );
  };
};
