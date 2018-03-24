import React from "react";
import { View, Button, TextInput, Text, ScrollView } from "react-native";
import { observer } from "mobx-react";
import DatePicker from "react-native-datepicker";
import glamorous from "glamorous-native";
import moment from "moment";
import _ from "lodash";

export default context => {
  const Label = require("components/Label").default(context);
  const FormItem = require("components/FormItem").default(context);
  const AutoCompleteLocation = require("components/AutoCompleteLocation").default(
    context
  );

  const SectorList = require("components/SectorList").default(context);

  const DateItemView = glamorous.view({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  });

  const dateFormat = "YYYY-MM-DD";

  const DateItem = observer(({ currentJob }) => (
    <DateItemView>
      <Label>Start Date</Label>
      <DatePicker
        style={{ width: 200 }}
        mode="date"
        placeholder="Select Start Date"
        format={dateFormat}
        minDate={moment().format(dateFormat)}
        maxDate={moment()
          .add(1, "year")
          .format(dateFormat)}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: "absolute",
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
        }}
        date={currentJob.map.get("start_date")}
        onDateChange={date => {
          currentJob.map.set("start_date", moment(date).format());
        }}
      />
    </DateItemView>
  ));
  const JobInfo = observer(({ currentJob }) => {
    console.log("JobInfo");
    return (
      <ScrollView>
        <View>
          <FormItem>
            <Label>Title</Label>
            <TextInput
              autoFocus={_.isEmpty(currentJob.map.get("title"))}
              placeholder="What is the position title to fill?"
              underlineColorAndroid="transparent"
              onChangeText={text => {
                currentJob.map.set("title", text);
              }}
              value={currentJob.map.get("title")}
            />
          </FormItem>
          <FormItem>
            <Label>Description</Label>
            <TextInput
              placeholder="Describe the job"
              underlineColorAndroid="transparent"
              multiline
              numberOfLines={4}
              onChangeText={text => {
                currentJob.map.set("description", text);
              }}
              value={currentJob.map.get("description")}
            />
          </FormItem>
        </View>
      </ScrollView>
    );
  });

  const Header = glamorous.view({
    backgroundColor: "orange",
    padding: 16,
    marginBottom: 14
  });

  const HeaderTitle = glamorous.text({
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  });

  const wizardConfig = {
    header: ({ title }) => (
      <Header>
        <HeaderTitle>{title} </HeaderTitle>
      </Header>
    ),
    controls: ({ onPrevious, onNext, isFirst, isLast, nextAllowed = true }) => (
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          margin: 30
        }}
      >
        {!isFirst ? (
          <Button color="blue" title="Previous" onPress={onPrevious} />
        ) : (
          <View />
        )}
        {!isLast && (
          <Button
            disabled={!nextAllowed}
            color="blue"
            title="Next"
            onPress={onNext}
          />
        )}
      </View>
    ),
    steps: [
      {
        title: "Job Type",
        content: JobInfo,
        nextAllowed: ({ currentJob }) => currentJob.isValid()
      },
      {
        title: "Sector",
        content: ({ currentJob, store }) => (
          <SectorList
            onPress={sector => {
              currentJob.map.set("sector", sector);
              store.next();
            }}
          />
        )
      },
      {
        title: "Date",
        content: props => <DateItem {...props} />
      },
      {
        title: "Where ?",
        content: ({ currentJob, store }) => (
          <AutoCompleteLocation
            onLocation={location => currentJob.setLocation(location)}
            store={store}
          />
        ),
        nextAllowed: ({ currentJob }) => currentJob.hasLocation()
      },
      {
        title: "Review",
        content: ({ onJobCreated, store }) => (
          <View>
            <Button
              color="blue"
              title="Create Job Post Now"
              onPress={() => {
                store.reset();
                onJobCreated();
              }}
            />
          </View>
        )
      }
    ]
  };

  const Wizard = require("components/Wizard").default(context, wizardConfig);

  return Wizard.View;
};
