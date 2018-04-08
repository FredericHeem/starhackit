import React from "react";
import { View, Button, Image, ScrollView } from "react-native";
import { observer } from "mobx-react";

import _ from "lodash";

const isEdit = navigation => !!navigation.state.params;

export default context => {
  const FormItem = require("components/FormItem").default(context);
  const LocationCard = require("components/LocationCard").default(context);
  const JobInfo = require("./JobInfo").default(context);
  const SectorCard = require("./SectorCard").default(context);
  const DateItem = require("./Dates").default(context);
  const EmploymentType = require("./EmploymentType").default(context);

  const JobEdit = observer(({ currentJob, navigation, onRemove }) => {
    const picture = currentJob.map.get("picture");

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
          <EmploymentType currentJob={currentJob} />
          <LocationCard
            placeHolder="Where is the Job Location?"
            location={currentJob.map.get("location").description}
            onPress={() => navigation.navigate("LocationEdit")}
          />
        </View>
        {picture.base64 && (
          <Image style={{ height: 300 }} source={{ uri: picture.base64 }} />
        )}
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
    );
  });

  return JobEdit;
};
