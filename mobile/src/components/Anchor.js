import React from "react";
import { Linking, Button } from "react-native";

export default () => {
  const onPress = async (href) => {
    console.log("href ", href);
    if (!href) {
      console.log("no href");
      return;
    }

    Linking.canOpenURL(href)
      .then(supported => {
        if (!supported) {
          console.log(`Can't handle url: ${href}`);
        } else {
          Linking.openURL(href).catch(err => {
            if (href.includes("telprompt")) {
              // telprompt was cancelled and Linking openURL method sees this as an error
              // it is not a true error so ignore it to prevent apps crashing
              // see https://github.com/anarchicknight/react-native-communications/issues/39
            } else {
              console.warn("openURL error", err);
            }
          });
        }
        return true;
      })
      .catch(err => console.warn("An unexpected error happened", err));
  };

  const Anchor = ({ href, title, ...props }) => (
    <Button title={title} {...props} onPress={() => onPress(href)} />
  );
  return Anchor;
};
