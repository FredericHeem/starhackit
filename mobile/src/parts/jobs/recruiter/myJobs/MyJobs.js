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
import { StackNavigator } from "react-navigation";
import _ from "lodash";
import glamorous from "glamorous-native";
import Lifecycle from "components/Lifecycle";
import moment from "moment";

const isEdit = navigation => !!navigation.state.params;

export default context => {
  const pathname = "recruiter/job"
  const createAsyncOp = require("core/asyncOp").default(context);
  const opsGetAll = createAsyncOp(() => context.rest.get(pathname));
  const opsUpdate = createAsyncOp(job =>
    context.rest.patch(`${pathname}/${job.id}`, job)
  );
  const opsCreate = createAsyncOp(job => context.rest.post(pathname, job));
  const opsDelete = createAsyncOp(jobId => context.rest.del(`${pathname}/${jobId}`));

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
      const error = hasJobError(job);
      if (error) {
        return displayError(error);
      }
      const jobCreated = await opsCreate.fetch(job);
      console.log("jobCreated ", jobCreated);
      Keyboard.dismiss();
      navigation.navigate("Jobs");
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
      navigation.navigate("Jobs");
    }),
    remove: action(async (jobId, navigation) => {
      console.log("remove  ", jobId)
      await opsDelete.fetch(jobId);
      Keyboard.dismiss();
      navigation.navigate("Jobs");
    })
  });

  const currentJob = observable.map({
    title: "",
    description: "",
    start_date: undefined
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

  const onPressItem = (job, navigation) => {
    console.log("onPressItem", job);
    currentJob.replace(job);
    navigation.navigate("JobEdit", job);
  };

  const MyJobs = observer(({ store, opsGetAll, onJobCreate, navigation }) => (
    <Page>
      {_.isEmpty(opsGetAll.data) && <EmptyJobs />}

      <List
        onPress={item => onPressItem(item, navigation)}
        data={opsGetAll.data}
      />
      <Button title="Create a new Job" onPress={onJobCreate} />
    </Page>
  ));
  /*
  const Loading = () => (
    <View>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  
*/

  const JobDetails = require("./JobEdit").default(context);

  const onJobCreate = navigation => {
    console.log("onJobCreate ");
    currentJob.replace({});
    navigation.navigate("JobEdit");
  };

  const onJobRemove = async (jobId, navigation) => {
    console.log("onJobRemove ", jobId);
    await store.remove(jobId, navigation);
    currentJob.replace({});
  };

  const jobSaveButton = navigation => (
    <View style={{ marginRight: 10 }}>
      <Button
        title={isEdit(navigation) ? "Update" : "Create"}
        onPress={() =>
          store[isEdit(navigation) ? "update" : "create"](
            currentJob.toJSON(),
            navigation
          )}
      />
    </View>
  );

  return StackNavigator(
    {
      Jobs: {
        screen: props => (
          <Lifecycle
            didMount={() => {
              console.log("didMount ");
              opsGetAll.fetch().catch(e => e);
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
        screen: props => (
          <JobDetails
            currentJob={currentJob}
            onRemove={job => onJobRemove(job, props.navigation)}
            details={props.navigation.state.params}
            {...props}
          />
        ),

        navigationOptions: ({ navigation }) => ({
          title: navigation.state.params
            ? "Edit a Job Post"
            : "Create a Job Post",
          header: undefined,
          headerRight: jobSaveButton(navigation)
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
