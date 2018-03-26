import React from "react";
import { observable } from "mobx";
import { View, ActivityIndicator, Image } from "react-native";
import { observer } from "mobx-react";
import Lifecycle from "components/Lifecycle";
import { createStackNavigator } from "react-navigation";
import glamorous from "glamorous-native";
import _ from "lodash";
import distanceFromLatLonInKm from "../../utils";

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
    const { coords } = stores.core.geoLoc.location;
    await opsGetAll.fetch({
      sectors: stores.profile.sectors.toJS(),
      lat: coords.latitude,
      lon: coords.longitude,
      max: "50"
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
    height: 80
  });

  const CompanyLogo = ({ logoURI }) => <LogoView source={{ uri: logoURI }} />;

  const Title = glamorous(Text)({
    fontSize: 16,
    fontWeight: "bold"
  });

  const Sector = glamorous(Text)({
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "lightgrey",
    alignSelf: "flex-start",
    borderRadius: 3,
    color: "grey",
    padding: 4
  });

  const JobDescription = glamorous(Text)({
    fontSize: 14
  });
  const CompanyName = glamorous(Text)({
    fontSize: 14,
    fontWeight: "bold"
  });

  const Location = glamorous(Text)({
    color: "grey"
  });

  const computeDistance = geo => {
    const { latitude, longitude } = _.get(
      context.stores.core.geoLoc,
      "location.coords"
    );
    if (!latitude || !geo) {
      return;
    }
    const [jobLat, jobLon] = geo.coordinates;
    //console.log("distance me", latitude, longitude);
    //console.log("distance jobs", geo);
    const distance = distanceFromLatLonInKm(
      latitude,
      longitude,
      jobLat,
      jobLon
    );
    //console.log("distance km", distance);
    return `${distance} km`;
  };
  const JobItem = ({ job }) => {
    const image64 = _.get(job.picture, "base64");
    return (
      <ItemView
        style={{
          padding: 8,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "flex-start"
        }}
      >
        <View style={{ flexGrow: 1 }}>
          <View>
            {job.company_logo_url && (
              <CompanyLogo logoURI={job.company_logo_url} />
            )}
          </View>
          {image64 && (
            <Image style={{ height: 200 }} source={{ uri: image64 }} />
          )}
          <Title>{job.title}</Title>
          <JobDescription>{job.description}</JobDescription>
          <Sector>{job.sector}</Sector>
          {job.company_name && <CompanyName>{job.company_name}</CompanyName>}
          {job.location && (
            <Location>
              {computeDistance(job.geo)}, {job.location.description}
            </Location>
          )}
        </View>
      </ItemView>
    );
  };

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
