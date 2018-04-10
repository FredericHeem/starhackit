import React from "react";
import { Button, Text } from "react-native";
import { View } from "glamorous-native";
import { observer } from "mobx-react";

export default context => {
  const Title = require("components/Title").default(context);
  const Card = require("components/Card").default(context);

  const Phone = observer(
    ({ phone, onPress }) => (
      <Card>
        <Card.Header>
          <Title>Phone Number</Title>
          <Button
            title={phone ? "Edit" : "Add"}
            onPress={onPress}
          />
        </Card.Header>
        <Card.Body>
          <View />
          {phone ? (
            <Text>{phone}</Text>
          ) : (
            <Text>Add you phone number.</Text>
          )}
        </Card.Body>
      </Card>
    )
  );
  return Phone;
};
