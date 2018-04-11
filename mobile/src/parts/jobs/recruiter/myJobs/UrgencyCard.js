import React from "react";
import { Button, Text } from "react-native";
import { observer } from "mobx-react";
import moment from "moment";

export default context => {
  const Title = require("components/Title").default(context);
  const Card = require("components/Card").default(context);

  const UrgencyCard = observer(({ currentJob, onEdit }) => (
    <Card>
      <Card.Header>
        <Title>Urgency</Title>
        <Button title="Edit" onPress={onEdit} />
      </Card.Header>
      <Card.Body style={{ zIndex: 1 }}>
        <Text>{moment(currentJob.map.get("start_date")).fromNow()}</Text>
      </Card.Body>
    </Card>
  ));

  return UrgencyCard;
};
