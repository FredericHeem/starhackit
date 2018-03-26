import React from "react";
import { View, Button, TextInput } from "react-native";
import { observer } from "mobx-react";
import glamorous from "glamorous-native";
import { observable } from "mobx";

export default context => {
  const Text = require("components/Text").default(context);

  const ApplyText = glamorous(Text)({
    marginBottom: 10
  });
  const store = observable({
    message: ""
  });
  const JobApply = observer(({ job, onApply }) => (
    <View style={{ margin: 20 }}>
      <View style={{ marginBottom: 20, padding: 20, backgroundColor: "white" }}>
        <ApplyText>
          Apply to work for {job.company_name} as a {job.title}
        </ApplyText>
        <TextInput
          multiline
          placeholder="Eventually leave a message "
          numberOfLines={4}
          onChangeText={text => {
            store.message = text;
          }}
          value={store.message}
        />
        
      </View>
      <Button title="Apply Now" onPress={() => onApply(job)} />
    </View>
  ));

  return JobApply;
};
