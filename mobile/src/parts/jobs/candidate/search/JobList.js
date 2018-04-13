import React from "react";
import { Image, View } from "react-native";
import glamorous from "glamorous-native";
import { observer } from "mobx-react";
import _ from "lodash";
import computeDistance from "./computeDistance";

export default context => {
  const Text = require("components/Text").default(context);
  const List = require("components/List").default(context);
  const Page = require("components/Page").default(context);
  const Rate = require("components/Rate").default(context);
  const StartDate = require("components/StartDate").default(context);
  const LoadingScreen = require("components/LoadingScreen").default(context);

  const ItemView = glamorous.view({
    margin: 6,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    backgroundColor: "white"
  });

  const LogoView = glamorous.image({
    height: 80
  });

  const CompanyLogo = ({ logoURI }) => <LogoView source={{ uri: logoURI }} />;

  const Title = glamorous(Text)({
    fontSize: 16,
    fontWeight: "bold"
  });

  const Sector = glamorous(Text)({
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "lightgrey",
    alignSelf: "flex-start",
    borderRadius: 3,
    color: "grey",
    padding: 4
  });

  const JobDescription = glamorous(Text)({
    fontSize: 14
  });

  const EmploymentType = glamorous(Text)({
    fontSize: 14
  });

  const CompanyName = glamorous(Text)({
    fontSize: 14,
    fontWeight: "bold"
  });

  const Location = glamorous(Text)({
    color: "grey"
  });

  const JobItem = ({ job }) => {
    const image64 = _.get(job.picture, "base64");
    console.log("JobItem ", job);
    return (
      <ItemView
        style={{
          padding: 8,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "flex-start"
        }}
      >
        <View style={{ flexGrow: 1 }}>
          <View>
            {job.company_logo_url && (
              <CompanyLogo logoURI={job.company_logo_url} />
            )}
          </View>
          {image64 && (
            <Image style={{ height: 200 }} source={{ uri: image64 }} />
          )}
          <Title>{job.title}</Title>
          <JobDescription>{job.description}</JobDescription>
          <Sector>{job.sector}</Sector>
          <View>
            <Rate job={job} />
            <EmploymentType>{job.employment_type}</EmploymentType>
          </View>
          <StartDate start_date={job.start_date} />

          {job.company_name && <CompanyName>{job.company_name}</CompanyName>}
          {job.location && (
            <Location>
              {computeDistance(job.geo, context.stores.core.geoLoc)} {`\u00b7`}{" "}
              {job.location.description}
            </Location>
          )}
        </View>
      </ItemView>
    );
  };

  const Jobs = observer(({ opsGetAll, onPressJob }) => {
    if (opsGetAll.loading && _.isEmpty(opsGetAll.data)) {
      return <LoadingScreen label="Loading Jobs..." />;
    }
    return (
      <Page>
        <List
          onPress={onPressJob}
          onKey={item => item.id}
          items={opsGetAll.data}
          renderItem={item => <JobItem job={item} />}
        />
      </Page>
    );
  });

  return Jobs;
};
