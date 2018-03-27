import React from "react";
import { View, Button, Keyboard, Alert } from "react-native";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { createStackNavigator } from "react-navigation";
import _ from "lodash";
import glamorous from "glamorous-native";
import Lifecycle from "components/Lifecycle";
import moment from "moment";

export default context => {
  const createAsyncOp = require("core/asyncOp").default(context);
  const Text = require("components/Text").default(context);
  const List = require("components/List").default(context);
  const LoadingScreen = require("components/LoadingScreen").default(context);
  const AutoCompleteLocation = require("components/AutoCompleteLocation").default(
    context
  );

  const JobEdit = require("./JobEdit").default(context);
  const JobWizard = require("./JobWizard").default(context);
  const JobMenu = require("./JobMenu").default(context);
  const Applicants = require("./Applicants").default(context);
  const Applicant = require("./Applicant").default(context);

  const pathname = "recruiter/job";
  
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
    business_type: "",
    picture: {}
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

  const currentApplicant = observable.map({});

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

  const JobTitle = glamorous.text({
    fontSize: 20,
    fontWeight: "bold"
  });

  const StartIn = glamorous.text({
    color: "grey"
  });

  const ListItem = ({ item }) => (
    <ItemView>
      <JobTitle>{item.title}</JobTitle>
      <Text>
        {_.isEmpty(item.job_applications) ? (
          "No applicant yet"
        ) : (
          `See ${item.job_applications.length} applicant(s)`
        )}
      </Text>
      {moment(item.start_date).isValid() && (
        <StartIn>Start {moment(item.start_date).fromNow()}</StartIn>
      )}
    </ItemView>
  );

  const onJobCreate = navigation => {
    console.log("onJobCreate ");
    currentJob.map.replace(defaultJob);
    navigation.navigate("JobWizard");
  };
  const onJobCreated = navigation => {
    console.log("onJobCreated ");
    store.create(currentJob.map.toJSON(), navigation);
  };
  const onMenuOpen = (job, navigation) => {
    //console.log("onMenuOpen ", job);
    currentJob.map.replace(job);
    navigation.navigate("JobMenu", job);
  };
  const onMenuPress = (menuItem, navigation) => {
    //console.log("onMenuPress ", menuItem);
    navigation.navigate(menuItem.screen);
  };

  const onJobRemove = async (jobId, navigation) => {
    console.log("onJobRemove ", jobId);
    await store.remove(jobId, navigation);
    currentJob.map.replace(defaultJob);
  };

  const onJobLocation = async (location, navigation) => {
    //console.log("onJobLocation ", location.description);
    await currentJob.setLocation(location);
    navigation.navigate("JobEdit");
  };
   const onApplicant = (applicant, navigation) => {
    currentApplicant.replace(applicant);
    navigation.navigate("Applicant", applicant);
  };

  const MyJobs = observer(({ opsGetAll, onJobCreate, navigation }) => {
    if (opsGetAll.loading) {
      return <LoadingScreen label="Loading Job Posts..." />;
    }
    return (
      <Page>
        {_.isEmpty(opsGetAll.data) ? (
          <EmptyJobs />
        ) : (
          <List
            onPress={job => onMenuOpen(job, navigation)}
            onKey={item => item.id}
            items={opsGetAll.data}
            renderItem={item => <ListItem item={item} />}
          />
        )}

        <Button title="Create a new Job" onPress={onJobCreate} />
      </Page>
    );
  });

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
      JobMenu: {
        screen: ({ navigation, ...props }) => (
          <JobMenu
            job={currentJob}
            onPress={menuItem => onMenuPress(menuItem, navigation)}
            {...props}
          />
        ),
        navigationOptions: () => ({
          title: "Job Post Menu",
          header: undefined
        })
      },
      Applicants: {
        screen: (props) => (
          <Applicants
            job={currentJob}
            onApplicant={applicant => onApplicant(applicant, props.navigation)}
            {...props}
          />
        ),
        navigationOptions: () => ({
          title: "Applicant List",
          header: undefined
        })
      },
      Applicant: {
        screen: (props) => (
          <Applicant
            applicant={currentApplicant}
            {...props}
          />
        ),
        navigationOptions: () => ({
          title: "Applicant",
          header: undefined
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
          header: null
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
