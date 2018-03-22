import React from "react";
import { TouchableOpacity } from "react-native";
import glamorous from "glamorous-native";

export default context => {
  const ListView = glamorous.view({
  });

  const ListItem = require("./ListItem").default(context);

  const List = ({ items, renderItem, onPress, onKey }) => (
    <ListView>
      {items.map(item => (
        <TouchableOpacity key={onKey(item)} onPress={() => onPress(item)}>
          <ListItem >{renderItem(item)}</ListItem>
        </TouchableOpacity>
      ))}
    </ListView>
  );
  return List;
};
