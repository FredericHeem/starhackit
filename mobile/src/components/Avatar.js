import React from "react";
import { Image } from "react-native";

export default () => {
  const Avatar = ({ url, ...props }) => (
    <Image
      {...props}
      style={{ borderRadius: 10, height: 50, width: 50, margin: 20 }}
      source={{ uri: url }}
    />
  );
  return Avatar;
};
