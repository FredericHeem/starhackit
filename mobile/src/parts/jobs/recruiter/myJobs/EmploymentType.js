import React from "react";
import { ScrollView } from "react-native";
import { observer } from "mobx-react";
import { SegmentedControls } from "react-native-radio-buttons";

export default context => {
  const Label = require("components/Label").default(context);
  const FormItem = require("components/FormItem").default(context);

  const options = ["Part Time", "Full Time"];

  const EmploymentType = observer(({ currentJob }) => {
    console.log("EmploymentType ", currentJob);
    return (
      <ScrollView>
        <FormItem>
          <Label>Employment Type</Label>
          <SegmentedControls
            options={options}
            onSelection={item => currentJob.map.set("employment_type", item)}
            selectedOption={currentJob.map.get("employment_type")}
          />
        </FormItem>

      </ScrollView>
    );
  });

  return EmploymentType;
};
