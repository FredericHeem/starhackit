import React from "react";
import { observable } from "mobx";
import { View, Button } from "react-native";
import Lifecycle from "components/Lifecycle";
import { createStackNavigator } from "react-navigation";
import _ from "lodash";

export default context => {
  const { stores } = context;
  const createAsyncOp = require("core/asyncOp").default(context);
  const opsGetAll = createAsyncOp(params =>
    context.rest.get(`candidate/job`, params)
  );
  const opsGetOne = createAsyncOp(({ id }) =>
    context.rest.get(`candidate/job/${id}`)
  );
  const opsApplicationApply = createAsyncOp(param =>
    context.rest.post(`candidate/application`, param)
  );
  

  opsGetAll.data = [];

  const store = observable({
    description: "",
    fetch: _.debounce(() => fetchJobs(), 1)
  });

  async function fetchJobs() {
    console.log("fetchJobs ", stores.profile.location);
    const { coords = {} } = stores.core.geoLoc.location;
    console.log("fetchJobs coords ", coords);
    await opsGetAll.fetch({
      sectors: stores.profile.sectors.toJS(),
      lat: coords.latitude,
      lon: coords.longitude,
      max: "50"
    });
  }

  store.location = "london";

  stores.jobs = store;

  const onPressJob = (job, navigation) => {
    navigation.navigate("JobDetails");
    opsGetOne.fetch({
      id: job.id
    });
  };
  const onApplyJob = (param, navigation) => {
    //console.log("onApplyJob ", param.jobId)
    opsApplicationApply.fetch(param);
    navigation.navigate("JobDetails");
  };

  const JobList = require("./JobList").default(context);
  const JobDetails = require("./JobDetails").default(context);
  const JobApply = require("./JobApply").default(context);

  const applyButton = navigation => (
    <View style={{ marginRight: 10 }}>
      <Button
        title="Apply"
        onPress={() => {
          console.log("apply");
          navigation.navigate("JobApply");
        }}
      />
    </View>
  );

  return createStackNavigator(
    {
      Jobs: {
        screen: props => (
          <Lifecycle
            didMount={() => {
              props.navigation.addListener("didFocus", () => {
                store.fetch();
              });
            }}
          >
            <JobList
              opsGetAll={opsGetAll}
              store={store}
              onPressJob={job => onPressJob(job, props.navigation)}
              {...props}
            />
          </Lifecycle>
        )
      },
      JobDetails: {
        screen: props => <JobDetails opsGetOne={opsGetOne} {...props} />,
        navigationOptions: ({ navigation }) => ({
          title: "Job Details",
          header: undefined,
          headerRight: applyButton(navigation)
        })
      },
      JobApply: {
        screen: ({ navigation, ...props }) => (
          <JobApply
            job={opsGetOne.data}
            onApply={param => onApplyJob(param, navigation)}
            {...props}
          />
        ),
        navigationOptions: () => ({
          title: "Apply",
          header: undefined
        })
      }
    },
    {
      navigationOptions: {
        header: null
      },
      mode: "modal"
    }
  );
};
