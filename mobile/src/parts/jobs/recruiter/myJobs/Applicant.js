import React from "react";
import { Image } from "react-native";
import { observer } from "mobx-react";
import glamorous, { View } from "glamorous-native";
import _ from "lodash";

export default context => {
  const Text = require("components/Text").default(context);
  const Page = require("components/Page").default(context);
  const Anchor = require("components/Anchor").default(context);

  const Applicant = observer(({ applicant }) => {
    console.log("Applicant ", applicant);
    const user = applicant.get("user");
    const profile_candidate = _.defaults(user.profile_candidate, {
      experiences: []
    });
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
        {user.picture && (
          <Image style={{ height: 200 }} source={{ uri: user.picture.url }} />
        )}
        <MainInfo>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {user.username}
          </Text>
          {user.email && (
            <Anchor href={`mailto:${user.email}`} title="Send Email" />
          )}
        </MainInfo>
        <Header>Message</Header>
        <Text
          style={{
            backgroundColor: "white",
            padding: 10
          }}
        >
          {applicant.get("message")}
        </Text>
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
        {profile_candidate.experiences && (
          <Experiences experiences={profile_candidate.experiences} />
        )}
      </Page>
    );
  });

  return Applicant;
};
