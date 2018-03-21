import React from "react";
import { observer } from "mobx-react";
import { Button, View } from "react-native";
import { Content, Item, Input, Label } from "native-base";

const isEdit = navigation => !!navigation.state.params;

export default (/*context*/) => {
  const ExperienceEdit = observer(
    ({ currentExperience, navigation, onRemove }) => (
      <Content>
        <View>
          <Item stackedLabel>
            <Label>Position</Label>
            <Input
              placeholder="What was your position?"
              onChangeText={text => {
                console.log("onChangeText ", currentExperience.position, text);
                currentExperience.position = text;
              }}
              value={currentExperience.position}
            />
          </Item>
          <Item stackedLabel>
            <Label>Company</Label>
            <Input
              placeholder="What was your the company name?"
              onChangeText={text => {
                currentExperience.company = text;
              }}
              value={currentExperience.company}
            />
          </Item>
        </View>
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
                title="Remove Experience" 
                onPress={() => onRemove(currentExperience, navigation)}
              />
            )}
          </View>
        </View>
      </Content>
    )
  );

  return ExperienceEdit;
};
