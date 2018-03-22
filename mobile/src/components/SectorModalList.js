import React from "react";
import { Text, Modal } from "react-native";
import { observer } from "mobx-react";

export default context => {
  const List = require("components/List").default(context);
  const Title = require("components/Title").default(context);

  const sectorItems = [
    "Bar - Restaurants - Clubs",
    "Catering - Events",
    "Construction"
  ];

  return observer(({ visible, onPress, onRequestClose }) => (
    <Modal
      animationType="fade"
      transparent={false}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <Title>Select a sector</Title>
      <List
        onPress={onPress}
        onKey={item => item}
        items={sectorItems}
        renderItem={item => <Text>{item}</Text>}
      />
    </Modal>
  ));
};
