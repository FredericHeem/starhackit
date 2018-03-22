import glamorous from "glamorous-native";

export default (/*{theme}*/) => {
  const ListItem = glamorous.view({
    margin: 6,
    padding: 6,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "red"
  });
  return ListItem;
};
