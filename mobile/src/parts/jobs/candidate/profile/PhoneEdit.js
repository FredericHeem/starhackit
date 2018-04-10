import React from "react";
import { observer } from "mobx-react";
import { View } from "react-native";
import { Content, Item, Input, Label } from "native-base";

export default (/*context*/) => {
  const PhoneEdit = observer(({ store }) => (
    <Content>
      <View>
        <Item stackedLabel>
          <Label>Phone Number</Label>
          <Input
            keyboardType="numeric"
            autoFocus
            placeholder="Enter phone number"
            onChangeText={text => {
              console.log("onChangeText ", text);
              store.phone = text;
            }}
            value={store.phone}
          />
        </Item>
      </View>
    </Content>
  ));

  return PhoneEdit;
};
