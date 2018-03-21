import React from "react";
import { Button, Text } from "native-base";
import styled from "styled-components/native";
import pkg from "../../package.json";
import config from "../config";

export default ({ stores }) => {
  const HomeView = styled.View`
    flex: 1;
    align-items: center;
    justify-content: space-between;
  `;

  const BodyView = styled.View`
    align-items: center;
  `;

  const Title = styled.Text`
    font-size: 36;
    padding: 10px;
  `;

  const ImageView = styled.Image`
    width: 150;
    height: 150;
  `;

  const SubTitle = styled.Text`
    font-size: 24;
    padding: 10px;
  `;

  const Header = styled.View``;

  const Footer = styled.View`
    margin-bottom: 10;
    padding: 10px;
  `;

  function BackGroundImage() {
    return <ImageView source={require("../../assets/logo_wheel_big.png")} />;
  }

  function Home({ navigation }) {
    return (
      <HomeView>
        <Header />
        <BodyView>
          <BackGroundImage />
          <Title>{config.title}</Title>
          <SubTitle>{config.subTitle}</SubTitle>
          <Button
            large
            info
            block
            onPress={async () => {
              const res = await stores.core.auth.login({type: "facebook"});
              if (res) {
                navigation.navigate("AuthApp");
              }
            }}
          >
            <Text>Continue with Facebook</Text>
          </Button>
        </BodyView>
        <Footer>
          <Text>
            <Text>{pkg.version}</Text>
          </Text>
        </Footer>
      </HomeView>
    );
  }

  return Home;
};
