import React from "react";
import { observer } from "mobx-react";
import _ from "lodash";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import glamorous from "glamorous-native";

export default context => {
  const Label = require("components/Label").default(context);

  const dateFormat = "YYYY-MM-DD";

  const DateItemView = glamorous.view({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  });

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
        date={currentJob.map.get("start_date")}
        onDateChange={date => {
          currentJob.map.set("start_date", moment(date).format());
        }}
      />
    </DateItemView>
  ));
  return DateItem;
};
