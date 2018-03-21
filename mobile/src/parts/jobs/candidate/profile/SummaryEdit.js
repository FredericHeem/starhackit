import React from "react";
import {observer} from "mobx-react"
import { TextInput } from "react-native";
import glamorous from "glamorous-native";

export default (/*context*/) => {
  const SummaryEditView = glamorous.view({
    margin: 10,
    height: 600
  })

  const SummaryEdit = observer(({ store }) => (
    <SummaryEditView>
      <TextInput
        multiline
        placeholder="Enter a summary of yourself"
        numberOfLines={4}
        onChangeText={text => {store.summary = text}}
        value={store.summary}
      />
    </SummaryEditView>
  ));

  return SummaryEdit;
};
