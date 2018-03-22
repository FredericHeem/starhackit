import React from "react";
import {
  View,
  TextInput,
  ActivityIndicator
} from "react-native";
import { observer } from "mobx-react";
import Icon from "react-native-vector-icons/FontAwesome";
import glamorous from "glamorous-native";
import _ from "lodash";

export default context => {
  const List = require("components/List").default(context);

  const ItemText = glamorous.text({
    fontSize: 18
  });

  const Suggestions = observer(({ suggestions = [], onPress }) => (
    <View style={{ height: 300 }}>
      <List
        onPress={onPress}
        onKey={item => item.id}
        items={suggestions}
        renderItem={item => <ItemText>{item.description}</ItemText>}
      />
    </View>
  ));

  const IconLeft = ({ loading }) => (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 40
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="grey" />
      ) : (
        <Icon name="search" size={20} color="grey" />
      )}
    </View>
  );

  const Search = observer(
    ({ store, suggestions, loading, onLocation, onSuggestion }) => (
      <View
        style={{
          zIndex: 10,
          backgroundColor: "white"
        }}
      >
        <View
          style={{
            flexGrow: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "flex-start",
            height: 50
          }}
        >
          <IconLeft loading={loading} />
          <TextInput
            autoFocus
            underlineColorAndroid="transparent"
            placeholder="Location, i.e London"
            style={{ flexGrow: 1, fontSize: 20 }}
            onChangeText={onLocation}
            value={store.location}
            clearButtonMode="while-editing"
            onSubmitEditing={() =>
              onSuggestion({ description: store.location })}
          />
        </View>
        {!_.isEmpty(suggestions) && (
          <Suggestions onPress={onSuggestion} suggestions={suggestions} />
        )}
      </View>
    )
  );

  return Search;
};
