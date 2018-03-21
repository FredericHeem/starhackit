import React from "react";
import { Text, Button } from "react-native";

export default context => {
  const Title = require("components/Title").default(context);
  const Card = require("./Card").default(context);

  const Summary = ({ navigation, store }) => (
    <Card>
      <Card.Header>
        <Title>Summary</Title>
        <Button
          title={store.summary ? "Edit" : "Add"}
          onPress={() => navigation.navigate("SummaryEdit")}
        />
      </Card.Header>
      <Card.Body>
        <Text>
          {store.summary ? (
            store.summary
          ) : (
            "Introduce yourself with a short bio."
          )}
        </Text>
      </Card.Body>
    </Card>
  );

  return Summary;
};
