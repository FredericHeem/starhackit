import React from "react";
import { View, TextInput } from "react-native";
import { observer } from "mobx-react";
import _ from "lodash";

export default context => {
  const Label = require("components/Label").default(context);
  const FormItem = require("components/FormItem").default(context);

  const JobInfo = observer(({ currentJob }) => {
    console.log("JobInfo");
    return (
      <View>
        <FormItem>
          <Label>Title</Label>
          <TextInput
            autoFocus={_.isEmpty(currentJob.map.get("title"))}
            placeholder="What is the position title to fill?"
            underlineColorAndroid="transparent"
            onChangeText={text => {
              currentJob.map.set("title", text);
            }}
            value={currentJob.map.get("title")}
          />
        </FormItem>
        <FormItem>
          <Label>Description</Label>
          <TextInput
            placeholder="Describe the job"
            underlineColorAndroid="transparent"
            multiline
            numberOfLines={4}
            onChangeText={text => {
              currentJob.map.set("description", text);
            }}
            value={currentJob.map.get("description")}
          />
        </FormItem>
      </View>
    );
  });

  return JobInfo;
};
