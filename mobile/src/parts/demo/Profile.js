import React from "react";
import { observable } from "mobx";
import { Image } from "react-native";
import { observer } from "mobx-react";

import { createStackNavigator } from "react-navigation";
import Lifecycle from "components/Lifecycle";
import _ from "lodash";

export default context => {
  const { stores, rest } = context;

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
  const Text = require("components/Text").default(context);

  const Profile = observer(({ store }) => (
    <Page>
      {store.map.get("picture") && (
        <Image style={{height: 50, width: 50}} source={{ uri: store.map.get("picture").url }} />
      )}
      <Text>Username</Text>
      <Text>{store.map.get("username")}</Text>
      <Text>Email</Text>
      <Text>{store.map.get("email")}</Text>
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
            <Profile
              store={store}
              {...props}
            />
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
