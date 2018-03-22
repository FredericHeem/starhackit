import glamorous from "glamorous-native";

export default (/*{theme}*/) => {
  const ListItem = glamorous.view({
    margin: 0,
    padding: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  });
  return ListItem;
};
