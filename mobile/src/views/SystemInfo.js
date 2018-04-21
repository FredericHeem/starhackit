import React from "react";
import { Platform } from "react-native";
import { Constants } from "expo";
import glamorous, {View} from "glamorous-native";

export default context => {
  const View = require("components/View").default(context);
  const Title = require("components/Title").default(context);
  const Text = require("components/Text").default(context);

  const data = [
    {
      key: "Platform OS",
      value: Platform.OS
    },
    {
      key: "Device Name",
      value: Constants.deviceName
    },
    {
      key: "Expo version",
      value: Constants.expoVersion
    },
    {
      key: "Device Year Class",
      value: Constants.deviceYearClass
    }
  ];

  if (Constants.platform.ios) {
    const { ios } = Constants.platform;

    const dataIOS = [
      {
        key: "Model",
        value: ios.model
      },
      {
        key: "Platform",
        value: ios.platform
      }
    ];
    data.concat(dataIOS);
  }

  const RowView = glamorous.view({
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 0.5
  });

  function Row(rowData, rowId) {
    return (
      <RowView key={rowId}>
        <Text>{`${rowData.key}`}</Text>
        <Text>{`${rowData.value}`}</Text>
      </RowView>
    );
  }

  const SystemInfoView = glamorous.scrollView({
    flex: 1,
    width: "100%",
    margin: 0
  });

  return function SystemInfo() {
    //const { navigate } = navigation;
    return (
      <SystemInfoView>
        <Title>Device Info</Title>
        <View>{data.map((datum, rowId) => Row(datum, rowId))}</View>
      </SystemInfoView>
    );
  };
};
