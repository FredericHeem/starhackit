import React from "react";
import { observable } from "mobx";
import { View, ActivityIndicator } from "react-native";
import { observer } from "mobx-react";
import Lifecycle from "components/Lifecycle";
import { createStackNavigator } from "react-navigation";
import glamorous from "glamorous-native";
import _ from "lodash";
import moment from "moment";
import Qs from "qs";

export default context => {
  const { stores } = context;
  const createAsyncOp = require("core/asyncOp").default(context);
  const opsGetAll = createAsyncOp(params =>
    context.rest.get(`candidate/job`, params)
  );
  const Text = require("components/Text").default(context);
  const List = require("components/List").default(context);
  const Page = require("components/Page").default(context);

  opsGetAll.data = [];

  const store = observable({
    description: "",
    fetch: _.debounce(() => fetchJobs(), 1)
  });

  async function fetchJobs() {
    console.log("fetchJobs ", stores.profile.location);
    const { geo } = stores.profile;
    await opsGetAll.fetch({
      sectors: stores.profile.sectors.toJS(),
      lat: geo.lat,
      lon: geo.lon
    });
  }

  store.location = "london";

  stores.jobs = store;

  const ItemView = glamorous.view({
    margin: 6,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    backgroundColor: "white"
  });

  const LogoView = glamorous.image({
    height: 80,
    width: 80
  });

  const CompanyLogo = ({ logoURI }) => (
    <LogoView resizeMode="contain" source={{ uri: logoURI }} />
  );

  const Title = glamorous(Text)({
    fontSize: 16,
    fontWeight: "bold"
  });

  const CompanyName = glamorous(Text)({
    fontSize: 14
  });

  const StartDate = glamorous(Text)({
    fontStyle: "italic",
    color: "grey"
  });

  const Location = glamorous(Text)({
    color: "grey"
  });

  const JobItem = ({ job }) => (
    <ItemView
      style={{
        padding: 8,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      }}
    >
      <View style={{ flexGrow: 1 }}>
        <Title>{job.title}</Title>
        {job.company && <CompanyName>@ {job.company}</CompanyName>}
        {job.location && <Location>{job.location.description}</Location>}
        {job.start_date && (
          <StartDate>Start {moment(job.start_date).fromNow()}</StartDate>
        )}
      </View>
      <View style={{ width: 70, height: 70 }}>
        {job.company_logo_url && <CompanyLogo logoURI={job.company_logo_url} />}
      </View>
    </ItemView>
  );

  const onPressItem = (item, navigation) => {
    console.log("onPressItem", item.title);
    navigation.navigate("JobDetails", item);
  };

  const Jobs = observer(({ opsGetAll, navigation }) => (
    <Page>
      {opsGetAll.loading && <ActivityIndicator size="large" color="grey" />}
      <List
        onPress={item => onPressItem(item, navigation)}
        onKey={item => item.id}
        items={opsGetAll.data}
        renderItem={item => <JobItem job={item} />}
      />
    </Page>
  ));

  const JobDetails = require("./JobDetails").default(context);

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
            <Jobs opsGetAll={opsGetAll} store={store} {...props} />
          </Lifecycle>
        )
      },
      JobDetails: {
        screen: props => (
          <JobDetails details={props.navigation.state.params} {...props} />
        ),
        navigationOptions: () => ({
          title: "Job Details",
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
