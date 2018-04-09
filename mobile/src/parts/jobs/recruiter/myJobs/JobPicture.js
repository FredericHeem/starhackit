import React from "react";
import { ScrollView, Button, Image } from "react-native";
import { observer } from "mobx-react";
import { ImagePicker } from "expo";

export default context => {
  const Label = require("components/Label").default(context);
  const FormItem = require("components/FormItem").default(context);

  const pickImage = async currentJob => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4,
      base64: true
    });
    //TODO check extension and change jpg to whatever it is
    if (!result.cancelled) {
      result.base64 = `data:image/jpg;base64,${result.base64}`;
      currentJob.map.set("picture", result);
    }
  };

  const JobPicture = observer(({ currentJob }) => {
    const picture = currentJob.map.get("picture");
    return (
      <ScrollView>
        <FormItem>
          <Label>Select a picture to describe the job </Label>
          <Button
            title="Pick an image from camera roll"
            onPress={() => pickImage(currentJob)}
          />
        </FormItem>
        {picture.base64 && (
          <Image style={{ height: 300 }} source={{ uri: picture.base64 }} />
        )}
      </ScrollView>
    );
  });

  return JobPicture;
};
