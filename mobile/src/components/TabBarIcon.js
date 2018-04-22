import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

export default () => ({ name, tintColor }) => (
  <Icon name={name} size={16} color={tintColor} />
);
