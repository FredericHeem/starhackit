import React from "react";
import { Text, View, Platform } from "react-native";
import styled from "styled-components/native";
import { Constants } from "expo";

export default () => {
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

  const RowView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    border-color: ${props => props.theme.content.borderColor};
    border-width: 0.5;
  `;

  function Row(rowData, rowId) {
    return (
      <RowView key={rowId}>
        <Text>{`${rowData.key}`}</Text>
        <Text>{`${rowData.value}`}</Text>
      </RowView>
    );
  }

  const SystemInfoView = styled.ScrollView`
    flex: 1;
    width: 100%;
    margin: 0;
  `;

  const Title = styled.Text`
    font-weight: bold;
    font-size: 18;
    padding: 8px;
    text-align: center;
  `;

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
