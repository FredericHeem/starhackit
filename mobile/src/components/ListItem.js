import glamorous from "glamorous-native";

export default (/*{theme}*/) => {
  const ListItem = glamorous.view({
    margin: 6,
    padding: 6,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  });
  return ListItem;
};
