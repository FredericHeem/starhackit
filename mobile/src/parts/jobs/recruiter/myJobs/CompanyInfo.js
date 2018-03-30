import React from "react";
import { View, TextInput, ScrollView } from "react-native";
import { observer } from "mobx-react";
import _ from "lodash";

export default context => {
  const Label = require("components/Label").default(context);
  const FormItem = require("components/FormItem").default(context);

  const CompanyInfo = observer(({ currentJob }) => {
    console.log("CompanyInfo");
    return (
      <ScrollView>
        <View>
          <FormItem>
            <Label>Company Name</Label>
            <TextInput
              autoFocus={_.isEmpty(currentJob.map.get("company_name"))}
              placeholder="What is the name of the company"
              underlineColorAndroid="transparent"
              onChangeText={text => {
                currentJob.map.set("company_name", text);
              }}
              value={currentJob.map.get("company_name")}
            />
          </FormItem>
          <FormItem>
            <Label>Business Type</Label>
            <TextInput
              placeholder="What is the business type, e.g. Restaurant, Hotel, Store"
              underlineColorAndroid="transparent"
              onChangeText={text => {
                currentJob.map.set("business_type", text);
              }}
              value={currentJob.map.get("business_type")}
            />
          </FormItem>
          <FormItem>
            <Label>Company Information</Label>
            <TextInput
              placeholder="Tell candidate why they should work for this company"
              underlineColorAndroid="transparent"
              multiline
              numberOfLines={4}
              onChangeText={text => {
                currentJob.map.set("company_info", text);
              }}
              value={currentJob.map.get("company_info")}
            />
          </FormItem>
        </View>
      </ScrollView>
    );
  });

  return CompanyInfo;
};
