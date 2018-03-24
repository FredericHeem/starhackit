import React from "react";
import { View, Button, TextInput, Text, ScrollView } from "react-native";
import { observer } from "mobx-react";
import DatePicker from "react-native-datepicker";
import glamorous from "glamorous-native";
import moment from "moment";
import _ from "lodash";

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

  const SectorCard = require("./SectorCard").default(context);

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
  const JobEdit = observer(({ currentJob, navigation, onRemove }) => (
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
          <SectorCard
            sector={currentJob.map.get("sector")}
            onPress={sector => {
              currentJob.map.set("sector", sector);
            }}
          />
          <FormItem>
            <DateItem currentJob={currentJob} />
          </FormItem>
          <LocationCard
            placeHolder="Where is the Job Location?"
            location={currentJob.map.get("location").description}
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
                  await onRemove(currentJob.map.get("id"), navigation);
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    ));

  return JobEdit;
};
