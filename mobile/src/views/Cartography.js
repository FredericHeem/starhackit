import React from "react";
import { MapView } from "expo";
import _ from "lodash";
import { observer } from "mobx-react";
import glamorous from "glamorous-native";

export default ({ stores }) => {
  const CartographyView = glamorous.view({
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  })

  const geoLocStore = stores.core.geoLoc;
  
/*
  const defaultRegion = {
    latitude: 10.8812484,
    longitude: -75.0906784,
    latitudeDelta: 1,
    longitudeDelta: 1
  };
*/

  const defaultRegion = {
    latitude: 51.6126,
    longitude: -0.1584,
    latitudeDelta: 1,
    longitudeDelta: 1
  };

  const Cartography = observer(function Cartography({
    geoLocStore
  }) {
    return (
      <CartographyView>
        <MapView
          style={{ flex: 1 }}
          
          initialRegion={_.defaults(geoLocStore.location.coords, defaultRegion)}
        />
      </CartographyView>
    );
  });

  return observer(({ navigation }) => (
    <Cartography navigation={navigation} geoLocStore={geoLocStore} />
  ));
};
