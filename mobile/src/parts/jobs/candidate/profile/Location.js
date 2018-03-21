import React from "react";
import { Button, Text, Modal } from "react-native";
import { observer } from "mobx-react";
import _ from "lodash";

export default context => {
  const Title = require("components/Title").default(context);
  const Card = require("./Card").default(context);

  const Location = observer(({ navigation, store }) => (
    <Card>
      <Card.Header>
        <Title>Location</Title>
        <Button
          title={store.getLocation() ? "Edit" : "Add"}
          onPress={() => {
            navigation.navigate("LocationEdit");
          }}
        />
      </Card.Header>
      <Card.Body>
        {_.isEmpty(store.getLocation()) ? (
          <Text>Where are you looking for a job?</Text>
        ) : (
          <Text>{store.getLocation()}</Text>
        )}
      </Card.Body>
    </Card>
  ));

  return props => <Location {...props} />;
};
