import React from "react";
import { View, Button, ScrollView } from "react-native";
import { observer } from "mobx-react";

const isEdit = navigation => !!navigation.state.params;

export default context => {
  const FormItem = require("components/FormItem").default(context);
  const LocationCard = require("components/LocationCard").default(context);
  const JobInfo = require("./JobInfo").default(context);
  const SectorCard = require("./SectorCard").default(context);
  const JobPicture = require("./JobPicture").default(context);
  const DateItem = require("./Dates").default(context);
  const EmploymentType = require("./EmploymentType").default(context);
  const SalaryCard = require("./SalaryCard").default(context);

  const JobEdit = observer(({ currentJob, navigation, onRemove }) => {
    return (
      <ScrollView>
        <View>
          <JobInfo currentJob={currentJob} />
          <SectorCard
            sector={currentJob.map.get("sector")}
            onPress={sector => {
              currentJob.map.set("sector", sector);
            }}
          />
          <FormItem>
            <DateItem currentJob={currentJob} />
          </FormItem>
          <SalaryCard
            currentJob={currentJob}
            onEdit={() => {
              navigation.navigate("Salary")
            }}
          />
          <EmploymentType currentJob={currentJob} />
          <LocationCard
            placeHolder="Where is the Job Location?"
            location={currentJob.map.get("location").description}
            onPress={() => navigation.navigate("LocationEdit")}
          />
        </View>
        <JobPicture currentJob={currentJob} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View style={{ paddingTop: 30, width: 200 }}>
            {isEdit(navigation) &&
              <Button
                color="red"
                title="Remove Job"
                onPress={async () => {
                  await onRemove(currentJob.map.get("id"), navigation);
                }}
              />}
          </View>
        </View>
      </ScrollView>
    );
  });

  return JobEdit;
};
