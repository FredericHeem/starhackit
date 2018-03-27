import React from "react";
import { View } from "react-native";
import { observer } from "mobx-react";
import glamorous from "glamorous-native";
import Lifecycle from "components/Lifecycle";
import moment from "moment";

export default context => {
  const Text = require("components/Text").default(context);
  const createAsyncOp = require("core/asyncOp").default(context);
  const List = require("components/List").default(context);

  const opsGetAll = createAsyncOp(() =>
    context.rest.get(`candidate/application`)
  );

  const LoadingScreen = require("components/LoadingScreen").default(context);

  const ApplicationItem = ({ item }) => {
    const { job } = item;
    return (
      <View
        style={{
          padding: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          alignContent: "flex-start"
        }}
      >
        <Text>
          {job.title} @ {job.company_name}{" "}
        </Text>
        <Text>{moment(item.created_at).fromNow()}</Text>
      </View>
    );
  };

  const JobApplicationList = observer(({ opsGetAll }) => {
    if (opsGetAll.loading){
      return <LoadingScreen label="Loading Jobs Applications..." />;
    }
    if (!opsGetAll.data) return null;
    console.log("opsGetAll.data ", opsGetAll.data);
    return (
      <View>
        <List
          onPress={() => {}}
          onKey={item => item.id}
          items={opsGetAll.data}
          renderItem={item => <ApplicationItem item={item} />}
        />
      </View>
    );
  });

  const JobApplicationTab = props => (
    <Lifecycle
      didMount={() =>
        props.navigation.addListener("didFocus", () => opsGetAll.fetch())}
    >
      <JobApplicationList opsGetAll={opsGetAll} {...props} />
    </Lifecycle>
  );
  return JobApplicationTab;
};
