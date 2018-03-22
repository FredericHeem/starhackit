import React from "react";
import {
  View,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import { observer } from "mobx-react";
import DatePicker from "react-native-datepicker";
import glamorous from "glamorous-native";
import moment from "moment";

const isEdit = navigation => !!navigation.state.params;

export default context => {
  const Label = require("components/Label").default(context);
  const FormItem = require("components/FormItem").default(context);
  const LocationCard = require("components/LocationCard").default(context);

  const DateItemView = glamorous.view({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  });

  const dateFormat = "YYYY-MM-DD";

  const Sector = require("./SectorCard").default(context);

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
        date={currentJob.get("start_date")}
        onDateChange={date => {
          currentJob.set("start_date", moment(date).format());
        }}
      />
    </DateItemView>
  ));
  const JobEdit = observer(({ currentJob, navigation, onRemove }) => {
    console.log("RENDER JOB EDIT");
    return (
      <ScrollView>
        <View>
          <FormItem>
            <Label>Title</Label>
            <TextInput
              autoFocus
              placeholder="What is the position title to fill?"
              underlineColorAndroid="transparent"
              onChangeText={text => {
                currentJob.set("title", text);
              }}
              value={currentJob.get("title")}
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
                currentJob.set("description", text);
              }}
              value={currentJob.get("description")}
            />
          </FormItem>
          <Sector
            sector={currentJob.get("sector")}
            onPress={sector => {
              currentJob.set("sector", sector);
            }}
          />
          <FormItem>
            <DateItem currentJob={currentJob} />
          </FormItem>
          <LocationCard
            placeHolder="Where is the Job Location?"
            location={currentJob.get("location").description}
            onPress={() => navigation.navigate("LocationEdit")}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View style={{ paddingTop: 30, width: 200 }}>
            {isEdit(navigation) && (
              <Button
                color="red"
                title="Remove Job"
                onPress={async () => {
                  await onRemove(currentJob.get("id"), navigation);
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    );
  });

  return JobEdit;
};
