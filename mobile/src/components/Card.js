import glamorous from "glamorous-native";

export default () => {
  const Card = glamorous.view({
    borderWidth: 1,
    borderColor: "lightgrey",
    borderStyle: "dotted",
    padding: 6,
    margin: 6,
    backgroundColor: "white"
  });

  Card.Header = glamorous.view({
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    borderStyle: "solid",
    marginBottom: 6,
    paddingBottom: 6,
    display: "flex",
    flexDirection:"row",
    justifyContent: "space-between",
    alignItems: "center"
  });

  Card.Body = glamorous.view({
    marginTop: 4,
    marginBottom: 4
  });

  Card.Footer = glamorous.view({
    marginTop: 10,
    marginBottom: 10
  });

  return Card;
};
