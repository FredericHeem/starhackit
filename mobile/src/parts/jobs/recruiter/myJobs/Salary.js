import React from "react";
import { ScrollView, TextInput, Picker } from "react-native";
import { observer } from "mobx-react";
import _ from "lodash";
import glamorous from "glamorous-native";

export default context => {
  const Label = require("components/Label").default(context);
  const Text = require("components/Text").default(context);
  const FormItemInline = glamorous.view({
    padding: 6,
    margin: 10,
    backgroundColor: "white",
    flexGrow: 1
  });

  const Row = glamorous.view({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  });

  const Salary = observer(({ currentJob }) => {
    console.log("Salary ", currentJob);
    return (
      <ScrollView>
        <Row>
          <FormItemInline>
            <Label>Minimum</Label>
            <TextInput
              keyboardType="numeric"
              autoFocus={_.isEmpty(currentJob.map.get("rate_min"))}
              placeholder="minimum"
              underlineColorAndroid="transparent"
              onChangeText={min => {
                currentJob.map.set("rate_min", min);
              }}
              onBlur={() => {
                console.log("onBlur");
                currentJob.setRateMin(currentJob.map.get("rate_min"));
              }}
              value={currentJob.map.get("rate_min")}
            />
          </FormItemInline>
          <FormItemInline>
            <Label>Maximun</Label>
            <TextInput
              keyboardType="numeric"
              placeholder="maximun"
              underlineColorAndroid="transparent"
              onChangeText={max => {
                currentJob.map.set("rate_max", max);
              }}
              onBlur={() => {
                currentJob.setRateMax(currentJob.map.get("rate_max"));
              }}
              value={currentJob.map.get("rate_max")}
            />
          </FormItemInline>
        </Row>
        <Row>
          <FormItemInline>
            <Label>Rate Period</Label>
            <Picker
              selectedValue={currentJob.map.get("rate_period")}
              onValueChange={ratePeriod =>
                currentJob.map.set("rate_period", ratePeriod)}
            >
              <Picker.Item label="Per Hour" value="hour" />
              <Picker.Item label="Per Day" value="day" />
              <Picker.Item label="Per Month" value="month" />
              <Picker.Item label="Per Year" value="year" />
            </Picker>
          </FormItemInline>
          <FormItemInline>
            <Label>Currency</Label>
            <Picker
              selectedValue={currentJob.map.get("currency")}
              onValueChange={currency =>
                currentJob.map.set("currency", currency)}
            >
              <Picker.Item label="US Dollar" value="USD" />
              <Picker.Item label="Euro" value="EUR" />
              <Picker.Item label="British Pound" value="GBP" />
            </Picker>
          </FormItemInline>
        </Row>
      </ScrollView>
    );
  });

  return Salary;
};
