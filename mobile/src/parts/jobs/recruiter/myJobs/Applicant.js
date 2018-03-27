import React from "react";
import { observer } from "mobx-react";
import glamorous, { View } from "glamorous-native";

export default context => {
  const Text = require("components/Text").default(context);
  const Page = require("components/Page").default(context);

  const Applicant = observer(({ applicant }) => {
    console.log("Applicant ", applicant);
    const user = applicant.get("user");
    const { profile_candidate = {} } = user;
    const MainInfo = glamorous.view({
      backgroundColor: "white",
      padding: 10
    });

    const Header = glamorous.text({
      color: "grey",
      fontWeight: "bold",
      padding: 10
    });

    const Experiences = ({ experiences }) => (
      <View backgroundColor="white" padding={10}>
        {experiences.map(experience => (
          <View flexDirection="row" key={experience.id}>
            <Text style={{ width: 100, fontWeight: "bold" }}>
              {experience.position}
            </Text>
            <Text>{experience.company}</Text>
          </View>
        ))}
      </View>
    );
    return (
      <Page>
        <MainInfo>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {user.username}
          </Text>
          <Text>{user.email}</Text>
        </MainInfo>
        <Header>Summary</Header>
        <Text
          style={{
            backgroundColor: "white",
            padding: 10
          }}
        >
          {profile_candidate.summary}
        </Text>
        <Header>Experiences</Header>
        <Experiences experiences={profile_candidate.experiences} />
      </Page>
    );
  });

  return Applicant;
};
