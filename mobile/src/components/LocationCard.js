import React from "react";
import { Button, Text } from "react-native";
import { observer } from "mobx-react";
import _ from "lodash";

export default context => {
  const Title = require("components/Title").default(context);
  const Card = require("./Card").default(context);

  const Location = observer(({ location, placeHolder, onPress }) => (
    <Card>
      <Card.Header>
        <Title>Location</Title>
        <Button
          title={location ? "Edit" : "Add"}
          onPress={onPress}
        />
      </Card.Header>
      <Card.Body>
        {_.isEmpty(location) ? (
          <Text>{placeHolder}</Text>
        ) : (
          <Text>{location}</Text>
        )}
      </Card.Body>
    </Card>
  ));

  return props => <Location {...props} />;
};
