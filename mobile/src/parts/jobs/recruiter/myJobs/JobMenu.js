import React from "react";
import { observer } from "mobx-react";
import glamorous from "glamorous-native";
import _ from "lodash";

export default context => {
  const Text = require("components/Text").default(context);
  const List = require("components/List").default(context);

  const actions = (job) => [
    {
      name: `See ${job.map.get("job_applications").length} Applicant(s)`,
      screen: "Applicants"
    },
    {
      name: "Edit Job",
      screen: "JobEdit"
    }
  ];

  const ItemView = glamorous.view({
    margin: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    backgroundColor: "white"
  });

  const ListItem = ({ item }) => (
    <ItemView>
      <Text>{item.name}</Text>
    </ItemView>
  );

  const filterActions = (job, actions) => {
    console.log("filterActions ", job)
    return _.reject(
      actions,
      action =>
        action.screen === "JobApplicant" && _.isEmpty(job.map.get("job_applications"))
    );
  }
  const JobMenu = observer(({ onPress, job }) => (
    <List
      onPress={onPress}
      onKey={item => item.name}
      items={filterActions(job, actions(job))}
      renderItem={item => <ListItem item={item} />}
    />
  ));

  return JobMenu;
};
