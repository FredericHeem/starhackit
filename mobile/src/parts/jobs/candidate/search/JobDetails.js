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
  const Date = glamorous.text({
    margin: 6,
    fontStyle: "italic",
    color: "grey"
  });
  const Location = glamorous.text({
    margin: 6,
  });

  const CompanyLogo = ({ logoURI }) => (
    <LogoView resizeMode="contain" source={{ uri: logoURI }} />
  );

  const JobDetails = ({ details }) => (
    <ScrollView>
      <Title>{details.title}</Title>
      <CompanyName> {details.company_name}</CompanyName>
      {details.company_logo_url && (
        <CompanyLogo logoURI={details.company_logo_url} />
      )}
      {details.location && <Location>{details.location.description}</Location>}
      {details.start_date && (
        <Date>Start {moment(details.start_date).fromNow()}</Date>
      )}
      {details.description && (
        <WebView
          source={{ html: details.description }}
          style={{ height: 3000, marginTop: 20 }}
        />
      )}
      {details.created_at && (
        <PublishedDate>
          Published {moment(details.created_at).fromNow()}
        </PublishedDate>
      )}
    </ScrollView>
  );
  return JobDetails;
};
