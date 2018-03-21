import React from "react";
import { Text, WebView } from "react-native";
import glamorous from "glamorous-native";
import moment from "moment";

export default () => {
  const ScrollView = glamorous.scrollview({
    backgroundColor: "white",
    flex: 1
  });

  const LogoView = glamorous.image({
    height: 100,
    margin: 10
  });

  const Title = glamorous.text({
    margin: 6,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  });

  const CompanyName = glamorous.text({
    margin: 6,
    fontSize: 20
  });

  const PublishedDate = glamorous.text({
    margin: 6,
    fontStyle: "italic",
    color: "grey"
  });

  const CompanyLogo = ({ logoURI }) => (
    <LogoView resizeMode="contain" source={{ uri: logoURI }} />
  );

  const JobDetails = ({ details }) => (
    <ScrollView>
      <Title>{details.title}</Title>
      <CompanyName> {details.company}</CompanyName>
      <CompanyLogo logoURI={details.company_logo_url} />
      <PublishedDate>
        Published {moment(details.created_at).fromNow()}
      </PublishedDate>
      <WebView
        source={{ html: details.description }}
        style={{ height: 3000, marginTop: 20 }}
      />
    </ScrollView>
  );
  return JobDetails;
};
