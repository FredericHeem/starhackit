import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import Icon from "react-native-vector-icons/Entypo";

import { createStackNavigator } from "react-navigation";
import Lifecycle from "components/Lifecycle";

export default context => {
  const { stores, rest, theme } = context;

  const pathname = "me";
  const createAsyncOp = require("core/asyncOp").default(context);
  const asyncOp = createAsyncOp();
  const asyncOpGet = () => asyncOp.execute(() => rest.get(pathname));

  const store = observable({
    map: observable.map({
      username: "",
      picture: {}
    })
  });

  stores.profile = store;

  const Page = require("components/Page").default(context);
  const View = require("components/View").default(context);
  const Text = require("components/Text").default(context);
  const ProfileHeader = require("components/ProfileHeader").default(context);

  const Profile = observer(({ store }) => (
    <Page>
      <ProfileHeader
        url={store.map.get("picture").url}
        username={store.map.get("username")}
      />

      <View
        shadow
        marginTop={20}
        padding={20}
        flexDirection="row"
        alignItems="center"
      >
        <Icon name="email" size={24} color={theme.textPrimary} />
        <View marginLeft={30}>
          <Text>EMAIL</Text>
          <Text bold>{store.map.get("email")}</Text>
        </View>
      </View>
    </Page>
  ));

  const Stack = createStackNavigator(
    {
      Profile: {
        screen: props => (
          <Lifecycle
            didMount={() => {
              props.navigation.addListener("didFocus", async () => {
                const profile = await asyncOpGet();
                //console.log("profile: ", profile);
                store.map.replace(profile);
              });
            }}
          >
            <Profile store={store} {...props} />
          </Lifecycle>
        )
      }
    },
    {
      navigationOptions: {
        header: null,
        headerTitleStyle: {
          fontFamily: context.theme.fontFamilyBold
        }
      },
      mode: "modal"
    }
  );

  return Stack;
};
