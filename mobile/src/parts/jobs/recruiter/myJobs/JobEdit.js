import React from "react";
import { View, Button, Text, TextInput, ScrollView } from "react-native";
import { observer } from "mobx-react";
import DatePicker from "react-native-datepicker";
import glamorous from "glamorous-native";
import moment from "moment";

const isEdit = navigation => !!navigation.state.params;

export default context => {
  const Label = require("components/Label").default(context);
  const FormItem = require("components/FormItem").default(context);
  const AutoCompleteLocation = require("components/AutoCompleteLocation").default(
    context
  );

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
              numberOfLines={10}
              onChangeText={text => {
                currentJob.set("description", text);
              }}
              value={currentJob.get("description")}
            />
          </FormItem>
          <FormItem>
            <DateItem currentJob={currentJob} />
          </FormItem>
          <FormItem>
            <Label>Location</Label>
            <Button
              title="Set Location"
              onPress={async () => {
                console.log("set location")
              }}
            />
            <Text>Loc</Text>
          </FormItem>
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
