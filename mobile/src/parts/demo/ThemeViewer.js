import React from "react";
import { ScrollView } from "react-native";
export default context => {
  const Text = require("components/Text").default(context);
  const View = require("components/View").default(context);
  const Button = require("components/Button").default(context);
  const ThemeViewer = () => (
    <ScrollView>
      <View>
        <Text>Primary</Text>
        <Text bold>Bold</Text>
        <Text secondary>Secondary</Text>
        <Text secondary bold>
          Bold Secondary
        </Text>
      </View>
      <View primary>
        <Text primaryOnPrimary>Primary on Primary</Text>
        <Text primaryOnPrimary bold>
          Bold Primary on Primary
        </Text>
        <Text secondaryOnPrimary>Secondary on Primary</Text>
        <Text secondaryOnPrimary bold>
          Bold Secondary on Primary
        </Text>
      </View>
      <View secondary>
        <Text primaryOnSecondary>Primary on Secondary</Text>
        <Text primaryOnSecondary bold>
          Bold Primary on Secondary
        </Text>
        <Text secondaryOnSecondary>Secondary on Secondary</Text>
        <Text secondaryOnSecondary bold>
          Bold Secondary on Secondary
        </Text>
      </View>
      <View>
        <View flexDirection="row" alignItems="center">
          <Button primary label="Button 1" />
          <Button primary disabled label="Disabled" />
          <Button primary small label="small" />
          <Text>Some Text</Text>
        </View>
        <Button primary label="Button primary " />
        <Button primary small label="small" />

        <Button secondary label="Button secondary" />
        <Button label="Button with Label" />
        <Button shadow label="Button with Label " />
        <Button shadow primary label="Button shadow primary " />
        <Button shadow secondary label="Button shadow secondary" />
        <Button>
          <Text style={{ borderWidth: 1 }}>Button</Text>
        </Button>
        <Button style={{ borderWidth: 1 }} shadow>
          <Text>Button shadow</Text>
        </Button>
      </View>
    </ScrollView>
  );
  return ThemeViewer;
};
