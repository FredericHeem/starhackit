import React from "react";
import { observable, action } from "mobx";
import { Keyboard, View, Button } from "react-native";
import { observer } from "mobx-react";

import styled from "styled-components/native";
import { createStackNavigator } from "react-navigation";
import Lifecycle from "components/Lifecycle";
import _ from "lodash";

export default context => {
  const { stores, rest } = context;

  const pathname = "candidate/profile";
  const createAsyncOp = require("core/asyncOp").default(context);
  const asyncOp = createAsyncOp();
  const asyncOpGet = () => asyncOp.execute(() => rest.get(pathname));
  const asyncOpPatch = input =>
    asyncOp.execute(params => rest.patch(pathname, params), input);

  const store = observable({
    geo: {},
    location: null,
    getLocation() {
      return _.get(asyncOp.data, "location.description");
    },
    saveLocation: action(async (location, navigation) => {
      const results = await context.stores.core.geoLoc.getGeoPosition(location.description);
      const geoLoc = _.get(results[0], "geometry.location");
      let geo;
      if(geoLoc){
        geo = { type: "Point", coordinates: [geoLoc.lat, geoLoc.lng] }
      }
      
      await asyncOpPatch({ location, geo });
      navigation.navigate("Profile");
    }),
    summary: null,
    saveSummary: action(async navigation => {
      await asyncOpPatch({ summary: store.summary });
      Keyboard.dismiss();
      navigation.navigate("Profile");
    }),
    savePhone: action(async navigation => {
      await asyncOpPatch({ phone: store.phone });
      Keyboard.dismiss();
      navigation.navigate("Profile");
    }),
    experiences: observable.map(),
    saveExperience: action(async (experience, navigation) => {
      if (!experience.id) {
        experience.id = require("uuid/v4")();
      }
      store.experiences.set(experience.id, experience);
      await asyncOpPatch({ experiences: store.experiences.values() });
      Keyboard.dismiss();
      navigation.navigate("Profile");
    }),
    removeExperience: action(async (experience, navigation) => {
      store.experiences.delete(experience.id);
      await asyncOpPatch({ experiences: store.experiences.values() });
      navigation.navigate("Profile");
    }),
    getExperiences() {
      return store.experiences.values();
    },
    currentExperience: {},
    sectors: [],
    phone: "",
    saveSector: action(async (sector, navigation) => {
      //console.log("saveSector ", sector);
      store.sectors = [...store.sectors, sector];
      await asyncOpPatch({ sectors: store.sectors });
      navigation.navigate("Profile");
    }),
    removeSector: action(async (sector, navigation) => {
      //console.log("removeSector ", sector);
      store.sectors.remove(sector);
      await asyncOpPatch({ sectors: store.sectors });
      navigation.navigate("Profile");
    })
  });

  stores.profile = store;

  const Page = require("components/Page").default(context);
  const UserInfoText = styled.View`margin: 0px;`;

  const Name = require("components/H1").default(context);

  const ImageView = styled.Image`height: 250px;`;

  const Phone = require("./Phone").default(context);
  const PhoneEdit = require("./PhoneEdit").default(context);

  const Summary = require("./Summary").default(context);
  const SummaryEdit = require("./SummaryEdit").default(context);

  const Experience = require("./Experience").default(context);
  const ExperienceEdit = require("./ExperienceEdit").default(context);
  const Sectors = require("./Sectors").default(context);

  const Location = require("./Location").default(context);
  const AutoCompleteLocation = require("components/AutoCompleteLocation").default(
    context
  );

  const onPressExperience = (experience, navigation) => {
    store.currentExperience = { ...store.currentExperience, ...experience };
    navigation.navigate("ExperienceEdit", { experience });
  };

  const onNewExperience = navigation => {
    store.currentExperience = {};
    navigation.navigate("ExperienceEdit");
  };

  const Profile = observer(({ store, navigation, authStore }) => (
    <Page>
      {authStore.picture && (
        <ImageView source={{ uri: authStore.picture.url }} />
      )}
      <UserInfoText>
        <Name>{stores.core.auth.me.name}</Name>
      </UserInfoText>
      <Phone phone={store.phone} onPress={() => navigation.navigate("PhoneEdit")}/>
      <Sectors
        sectors={store.sectors}
        store={store}
        navigation={navigation}
        onNewSector={sector => store.saveSector(sector, navigation)}
        onSectorDelete={sector => store.removeSector(sector, navigation)}
      />
      <Location store={store} navigation={navigation} />
      <Experience
        navigation={navigation}
        store={store}
        experiences={store.getExperiences()}
        onPressExperience={onPressExperience}
        onNewExperience={onNewExperience}
      />
      <Summary navigation={navigation} store={store} />
    </Page>
  ));

  const summarySaveButton = navigation => (
    <View style={{ marginRight: 10 }}>
      <Button title="Save" onPress={() => store.saveSummary(navigation)} />
    </View>
  );
  const phoneSaveButton = navigation => (
    <View style={{ marginRight: 10 }}>
      <Button title="Save" onPress={() => store.savePhone(navigation)} />
    </View>
  );
  const experienceSaveButton = navigation => (
    <View style={{ marginRight: 10 }}>
      <Button
        title="Save"
        onPress={() =>
          store.saveExperience(store.currentExperience, navigation)}
      />
    </View>
  );

  const Stack = createStackNavigator(
    {
      Profile: {
        screen: props => (
          <Lifecycle
            didMount={() => {
              props.navigation.addListener("didFocus", async () => {
                const profile = await asyncOpGet();
                store.location = profile.location;
                console.log("profile: ", profile)
                store.experiences.replace(_.keyBy(profile.experiences, "id"));
                store.summary = profile.summary;
                store.geo = profile.geo || {};
                store.sectors = profile.sectors || [];
                store.phone = profile.phone;
                stores.core.auth.getPicture();
              });
            }}
          >
            <Profile
              store={store}
              authStore={context.stores.core.auth}
              {...props}
            />
          </Lifecycle>
        )
      },
      LocationEdit: {
        screen: ({ navigation }) => (
          <AutoCompleteLocation
            onLocation={location => store.saveLocation(location, navigation)}
            store={store}
          />
        ),
        navigationOptions: () => ({
          title: "Edit Location",
          header: undefined
        })
      },
      SummaryEdit: {
        screen: () => <SummaryEdit store={store} />,
        navigationOptions: ({ navigation }) => ({
          title: "Edit Summary",
          header: undefined,
          headerRight: summarySaveButton(navigation)
        })
      },
      PhoneEdit: {
        screen: () => <PhoneEdit store={store} />,
        navigationOptions: ({ navigation }) => ({
          title: "Edit Phone Number",
          header: undefined,
          headerRight: phoneSaveButton(navigation)
        })
      },
      ExperienceEdit: {
        screen: observer(({ navigation }) => (
          <ExperienceEdit
            currentExperience={store.currentExperience}
            navigation={navigation}
            onRemove={experience =>
              store.removeExperience(experience, navigation)}
          />
        )),
        navigationOptions: ({ navigation }) => ({
          title: navigation.state.params ? "Edit Experience" : "Add Experience",
          header: undefined,
          headerRight: experienceSaveButton(navigation)
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

  return Stack;
};
