import React from "react";
import {
  Text,
  View,
  Button,
  Keyboard,
  TouchableHighlight,
  Alert
} from "react-native";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { createStackNavigator } from "react-navigation";
import _ from "lodash";
import glamorous from "glamorous-native";
import Lifecycle from "components/Lifecycle";
import moment from "moment";

export default context => {
  const AutoCompleteLocation = require("components/AutoCompleteLocation").default(
    context
  );
  const pathname = "recruiter/job";
  const createAsyncOp = require("core/asyncOp").default(context);
  const opsGetAll = createAsyncOp(() => context.rest.get(pathname));
  const opsUpdate = createAsyncOp(job =>
    context.rest.patch(`${pathname}/${job.id}`, job)
  );
  const opsCreate = createAsyncOp(job => context.rest.post(pathname, job));
  const opsDelete = createAsyncOp(jobId =>
    context.rest.del(`${pathname}/${jobId}`)
  );

  const hasJobError = job => {
    if (_.isEmpty(job.title)) {
      return "Please provide a title";
    }
  };

  const displayError = error => {
    Alert.alert(error);
  };

  const store = observable({
    jobs: observable.map(),
    create: action(async (job, navigation) => {
      console.log("create ", job);
      const error = hasJobError(job);
      if (error) {
        return displayError(error);
      }
      const jobCreated = await opsCreate.fetch(job);
      console.log("jobCreated ", jobCreated);
      Keyboard.dismiss();
      navigation.navigate("MyJobs");
    }),
    update: action(async (job, navigation) => {
      console.log("update job ", job);
      const error = hasJobError(job);
      if (error) {
        return displayError(error);
      }
      const jobUpdated = await opsUpdate.fetch(job);
      console.log("jobUpdated ", jobUpdated);
      Keyboard.dismiss();
      navigation.navigate("MyJobs");
    }),
    remove: action(async (jobId, navigation) => {
      console.log("remove  ", jobId);
      await opsDelete.fetch(jobId);
      Keyboard.dismiss();
      navigation.navigate("MyJobs");
    })
  });

  const defaultJob = {
    title: "",
    description: "",
    start_date: undefined,
    location: {},
    geo: {},
    company_name: "",
    company_info: "",
    business_type: ""
  };


  const currentJob = observable({
    map: observable.map(defaultJob),
    setLocation: async location => {
      console.log("setLocation ", location);
      const results = await context.stores.core.geoLoc.getGeoPosition(
        location.description
      );
      const geoLoc = _.get(results[0], "geometry.location");
      console.log("geoLoc ", geoLoc);
      if (geoLoc) {
        currentJob.map.set("geo", {
          type: "Point",
          coordinates: [geoLoc.lat, geoLoc.lng]
        });
      }
      currentJob.map.set("location", location);
    },
    hasSector: () => !_.isEmpty(currentJob.map.get("sector")),
    hasLocation: () => !_.isEmpty(currentJob.map.get("location")),
    isValid: () =>
      currentJob.map.get("title") && currentJob.map.get("description"),
    isCompanyInfoValid: () =>
      currentJob.map.get("company_name") && currentJob.map.get("company_info")
  });

  const Page = require("components/Page").default(context);

  const EmptyJobs = () => (
    <View style={{ margin: 20 }}>
      <Text style={{ textAlign: "center", fontSize: 20 }}>
        No job post has been created so far. Please create a new job post.
      </Text>
    </View>
  );

  const ItemView = glamorous.view({
    margin: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    backgroundColor: "white"
  });

  const LogoView = glamorous.image({
    height: 50
  });

  const CompanyLogo = ({ logoURI }) => (
    <View style={{}}>
      <LogoView resizeMode="contain" source={{ uri: logoURI }} />
    </View>
  );

  const JobTitle = glamorous.text({
    fontSize: 20,
    fontWeight: "bold"
  });
  const StartIn = glamorous.text({
    color: "grey"
  });
  const ListItem = ({ item, onPress }) => (
    <TouchableHighlight onPress={() => onPress(item)}>
      <ItemView>
        <JobTitle>{item.title}</JobTitle>
        <Text>{_.get(item.location, "description")}</Text>
        {moment(item.start_date).isValid() && (
          <StartIn>Start {moment(item.start_date).fromNow()}</StartIn>
        )}
        {item.company_logo ? (
          <CompanyLogo logoURI={item.company_logo} />
        ) : (
          <Text>{item.company}</Text>
        )}
      </ItemView>
    </TouchableHighlight>
  );

  const List = ({ data, onPress }) => (
    <View>
      {data &&
        data.map(item => (
          <ListItem onPress={onPress} item={item} key={item.id} />
        ))}
    </View>
  );

  const onJobEdit = (job, navigation) => {
    console.log("onJobCreation", job);
    currentJob.map.replace(job);
    navigation.navigate("JobEdit", job);
  };

  const MyJobs = observer(({ store, opsGetAll, onJobCreate, navigation }) => (
    <Page>
      {_.isEmpty(opsGetAll.data) && <EmptyJobs />}
      <List
        onPress={item => onJobEdit(item, navigation)}
        data={opsGetAll.data}
      />
      <Button title="Create a new Job" onPress={onJobCreate} />
    </Page>
  ));

  const JobEdit = require("./JobEdit").default(context);
  const JobWizard = require("./JobWizard").default(context);

  const onJobCreate = navigation => {
    console.log("onJobCreate ");
    currentJob.map.replace(defaultJob);
    navigation.navigate("JobWizard");
  };
  const onJobCreated = navigation => {
    console.log("onJobCreated ");
    store.create(currentJob.map.toJSON(), navigation);
  };
  const onJobRemove = async (jobId, navigation) => {
    console.log("onJobRemove ", jobId);
    await store.remove(jobId, navigation);
    currentJob.map.replace(defaultJob);
  };

  const onJobLocation = async (location, navigation) => {
    console.log("onJobLocation ", location.description);
    await currentJob.setLocation(location);
    navigation.navigate("JobEdit");
  };

  const jobSaveButton = navigation => (
    <View style={{ marginRight: 10 }}>
      <Button
        title="Update"
        onPress={() => store.update(currentJob.map.toJSON(), navigation)}
      />
    </View>
  );

  return createStackNavigator(
    {
      MyJobs: {
        screen: props => (
          <Lifecycle
            didMount={() => {
              props.navigation.addListener("didFocus", () => {
                opsGetAll.fetch().catch(e => e);
              });
            }}
            willUnmount={() => console.log("willUnmount ")}
          >
            <MyJobs
              opsGetAll={opsGetAll}
              store={store}
              onJobCreate={() => onJobCreate(props.navigation)}
              {...props}
            />
          </Lifecycle>
        )
      },
      JobEdit: {
        screen: ({ navigation, ...props }) => (
          <JobEdit
            currentJob={currentJob}
            onRemove={job => onJobRemove(job, navigation)}
            details={navigation.state.params}
            navigation={navigation}
            onLocation={location => onJobLocation(location, navigation)}
            {...props}
          />
        ),

        navigationOptions: ({ navigation }) => ({
          title: "Edit a Job Post",
          header: undefined,
          headerRight: jobSaveButton(navigation)
        })
      },
      JobWizard: {
        screen: ({ navigation, ...props }) => (
          <JobWizard
            currentJob={currentJob}
            details={navigation.state.params}
            navigation={navigation}
            onJobCreated={() => onJobCreated(navigation)}
            {...props}
          />
        ),

        navigationOptions: (/*{ navigation }*/) => ({
          title: "Create a Job Post",
          header: undefined
        })
      },
      LocationEdit: {
        screen: ({ navigation }) => (
          <AutoCompleteLocation
            onLocation={location => onJobLocation(location, navigation)}
          />
        ),
        navigationOptions: () => ({
          title: "Edit Location",
          header: undefined
        })
      }
    },
    {
      navigationOptions: {
        header: null
      },
      mode: "modal"
      //initialRouteName: "JobWizard"
    }
  );
};
