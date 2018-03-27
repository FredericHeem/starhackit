import React from "react";
import { View } from "react-native";

import { observer } from "mobx-react";
import glamorous from "glamorous-native";
import _ from "lodash";

export default context => {

  const Text = require("components/Text").default(context);
  const List = require("components/List").default(context);

  const ApplicantItem = ({ item }) => (
    <View>
      <Text>{item.user.username}</Text>
      <Text>{item.user.email}</Text>
    </View>
  );

  const ApplicantList = observer(({ job, onApplicant }) => {
    const applications = job.map.get("job_applications")
    console.log("ApplicantList ", applications);
    return (
      <View>
        <List
          onPress={item => onApplicant(item)}
          onKey={item => item.id}
          items={applications}
          renderItem={item => <ApplicantItem item={item} />}
        />
      </View>
    );
  });

  return ApplicantList;
};
