import React from "react";
import { observable } from "mobx";
import { Image } from "react-native";
import { observer } from "mobx-react";
import glamorous from "glamorous-native";
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

  const PictureView = glamorous(View)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 150,
    margin: 0
  });

  const Picture = observer(({ url }) => (
    <PictureView primary>
      <Image
        style={{ borderRadius: 10, height: 50, width: 50, margin: 20 }}
        source={{ uri: url }}
      />
      <Text primaryOnPrimary large>
        {store.map.get("username")}
      </Text>
    </PictureView>
  ));

  const Profile = observer(({ store }) => (
    <Page>
      {store.map.get("picture") && (
        <Picture url={store.map.get("picture").url} />
      )}
      <View margin={20} flexDirection="row" alignItems="center">
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
                console.log("profile: ", profile);
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
        header: null
      },
      mode: "modal"
    }
  );

  return Stack;
};
