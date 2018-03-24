import React from "react";
import { Modal } from "react-native";
import { observer } from "mobx-react";

export default context => {
  const Title = require("components/Title").default(context);
  const SectorList = require("components/SectorList").default(context);

  return observer(({ visible, onPress, onRequestClose }) => (
    <Modal
      animationType="fade"
      transparent={false}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <Title>Select a sector</Title>
      <SectorList onPress={onPress} />
    </Modal>
  ));
};
