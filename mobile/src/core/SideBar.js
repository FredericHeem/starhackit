import React from "react";
import styled from "styled-components/native";
import { Text, List, ListItem } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

export default ({ stores }) => {
  const SideBarView = styled.View`
    flex: 1;
    justify-content: flex-start;
    align-items: stretch;
    flex-direction: column;
  `;

  const UserInfo = styled.View`
    flex-direction: row;
    align-items: stretch;
    flex: 0 1 auto;
    margin: 10px;
  `;

  const UserInfoText = styled.View`
    flex: 1;
    flex-direction: column;
  `;

  const Name = styled.Text`
    font-size: 20;
    padding: 10px;
    font-weight: bold;
  `;

  const ImageView = styled.Image`
    width: 80;
    height: 80;
    border-radius: 25;
  `;

  const IconView = styled.View`
    width: 24px;
    margin: 6px;
  `;

  function SideBar({ navigation }) {
    const routes = [
      {
        caption: "Home",
        icon: "home",
        onPress: () => {
          navigation.navigate("Main");
        }
      },
      {
        caption: "Map",
        icon: "map",
        onPress: () => {
          navigation.navigate("Cartography");
        }
      },
      {
        caption: "Profile",
        icon: "user",
        onPress: () => {
          navigation.navigate("Profile");
        }
      },
      {
        caption: "Info",
        icon: "info",
        onPress: () => {
          navigation.navigate("SystemInfo");
        }
      },
      {
        caption: "Logout",
        icon: "sign-out",
        onPress: () => {
          stores.core.auth.logout();
          navigation.navigate("Home");
        }
      }
    ];

    return (
      <SideBarView>
        <UserInfo>
          <ImageView source={{ uri: stores.core.facebook.picture.url }} />
          <UserInfoText>
            <Name>{stores.core.facebook.me.name}</Name>
          </UserInfoText>
        </UserInfo>
        <List
          dataArray={routes}
          renderRow={data => (
            <ListItem button onPress={data.onPress}>
              <IconView>
                <Icon name={data.icon} size={24} />
              </IconView>
              <Text>{data.caption}</Text>
            </ListItem>
          )}
        />
      </SideBarView>
    );
  }

  return SideBar;
};
