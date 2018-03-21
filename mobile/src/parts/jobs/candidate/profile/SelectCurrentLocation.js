import React from "react";
import { View, Button, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { observer } from "mobx-react";
import glamorous from "glamorous-native";
import _ from "lodash";
import { observable } from "mobx";
export default context => {
  const ItemView = glamorous.view({
    padding: 10,
    margin: 0,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1
  });

  const ItemText = glamorous.text({
    fontSize: 18
  });

  const Item = ({ item, onPress }) => (
    <TouchableOpacity onPress={() => onPress(item)}>
      <ItemView>
        <ItemText>{item.formatted_address}</ItemText>
      </ItemView>
    </TouchableOpacity>
  );

  const Places = observer(({ places = [], onPress }) => (
    <ScrollView
      style={{
        width: "100%",
        backgroundColor: "white"
      }}
    >
      {places.map(item => (
        <Item onPress={onPress} key={item.place_id} item={item} />
      ))}
    </ScrollView>
  ));

  const geoLocStore = context.stores.core.geoLoc;

  const store = observable({
    loading: false
  });

  const getCurrentLoc = async () => {
    store.loading = true;
    try {
      await geoLocStore.get();
      await geoLocStore.getCity();
    } catch (error) {
      console.log("getCurrentLoc: ", error);
    }
    store.loading = false;
  };

  const CurrentLocation = () => (
    <Button
      title="Get Current Location"
      style={{ margin: 40, paddingHorizontal: 40 }}
      onPress={() => getCurrentLoc()}
    />
  );

  const SelectCurrentLocation = observer(({ store, onSelectLocation }) => (
    <View style={{ marginTop: 30 }}>
      {_.isEmpty(geoLocStore.addresses) && <CurrentLocation />}
      {store.loading && <ActivityIndicator size="large" color="grey" />}
      <Places places={geoLocStore.addresses} onPress={onSelectLocation} />
    </View>
  ));

  return props => <SelectCurrentLocation store={store} {...props}/>;
};
