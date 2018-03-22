import React from "react";
import { TouchableOpacity } from "react-native";
import { observer } from "mobx-react";
import glamorous from "glamorous-native";

export default context => {
  const ListView = glamorous.scrollView({});

  const ListItem = require("./ListItem").default(context);

  const List = observer(({ items, renderItem, onPress, onKey }) => (
    <ListView>
      {items.map(item => (
        <TouchableOpacity key={onKey(item)} onPress={() => onPress(item)}>
          <ListItem>{renderItem(item)}</ListItem>
        </TouchableOpacity>
      ))}
    </ListView>
  ));

  return List;
};
