import React from "react";
import { Button, TouchableHighlight, Text} from "react-native";
import { List } from "native-base";
import glamorous, { View } from "glamorous-native";
import _ from "lodash";

export default context => {
  const Title = require("components/Title").default(context);
  const Card = require("./Card").default(context);

  const ExperienceItemView = glamorous.view({
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: "lightgrey",
    borderTopWidth: 1,
    padding: 6
  });

  const Position = glamorous.text({
    fontSize: 18,
    marginBottom: 8
  });

  const Company = glamorous.text({
    fontSize: 14
  });

  const ExperienceItem = ({ experience, onPressExperience }) => (
    <TouchableHighlight onPress={() => onPressExperience(experience)}>
      <ExperienceItemView>
        <View>
          <Position>{experience.position}</Position>
          <Company>{experience.company}</Company>
        </View>
        <View>
          <Text>Edit</Text>
        </View>
      </ExperienceItemView>
    </TouchableHighlight>
  );

  const ExperienceList = ({ experiences, onPressExperience }) => (
    <List>
      {experiences.map(experience => (
        <ExperienceItem
          key={experience.id}
          experience={experience}
          onPressExperience={onPressExperience}
        />
      ))}
    </List>
  );

  const Experience = ({
    navigation,
    experiences,
    onPressExperience,
    onNewExperience
  }) => (
    <Card>
      <Card.Header>
        <Title>Experiences</Title>
        <Button
          title="Add"
          onPress={() => onNewExperience(navigation)}
        />
      </Card.Header>
      <Card.Body>
        <View/>
        {experiences.length ? (
          <ExperienceList
            navigation={navigation}
            experiences={experiences}
            onPressExperience={experience =>
              onPressExperience(experience, navigation)}
          />
        ) : (
          <Text>Please add your past experiences</Text>
        )}
      </Card.Body>
    </Card>
  );

  return Experience;
};
