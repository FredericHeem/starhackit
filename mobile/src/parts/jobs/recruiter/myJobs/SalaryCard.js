import React from "react";
import { Button, Text } from "react-native";
import { observer } from "mobx-react";
import _ from "lodash";

export default context => {
  const Title = require("components/Title").default(context);
  const Card = require("components/Card").default(context);

  const displayRate = (min, max, currency) => {
    if(min === max){
      return `${currency} ${min}`
    }
    return `${currency} ${min} - ${max}`
  }
  const SalaryCard = observer(({ currentJob, onEdit }) => {
    const rateMin = currentJob.map.get("rate_min");
    const rateMax = currentJob.map.get("rate_max");
    const currency = currentJob.map.get("currency");
    const ratePeriod = currentJob.map.get("rate_period");

    return (
    <Card>
      <Card.Header>
        <Title>Salary</Title>
        <Button
          title={rateMin ? "Edit" : "Add"}
          onPress={onEdit}
        />
      </Card.Header>
      <Card.Body style={{ zIndex: 1 }}>
        {_.isEmpty(rateMin) ? (
          <Text>What is the salary?</Text>
        ) : (
          <Text>{`${displayRate(rateMin, rateMax, currency)} per ${ratePeriod}`}</Text>
        )}
      </Card.Body>
    </Card>
  )});

  return props => <SalaryCard {...props} />;
};
