import React from "react";

export default context => {
  const Text = require("components/Text").default(context);
  const View = require("components/View").default(context);

  const ThemeViewer = () => (
    <View>
      <View>
        <Text>Primary</Text>
        <Text bold>Bold</Text>
        <Text secondary>Secondary</Text>
        <Text secondary bold>Bold Secondary</Text>
      </View>
      <View primary>
        <Text primaryOnPrimary>Primary on Primary</Text>
        <Text primaryOnPrimary bold>Bold Primary on Primary</Text>
        <Text secondaryOnPrimary>Secondary on Primary</Text>
        <Text secondaryOnPrimary bold>Bold Secondary on Primary</Text>
      </View>
      <View secondary>
        <Text primaryOnSecondary>Primary on Secondary</Text>
        <Text primaryOnSecondary bold>Bold Primary on Secondary</Text>
        <Text secondaryOnSecondary>Secondary on Secondary</Text>
        <Text secondaryOnSecondary bold >Bold Secondary on Secondary</Text>
        
      </View>
    </View>
  );
  return ThemeViewer;
};
