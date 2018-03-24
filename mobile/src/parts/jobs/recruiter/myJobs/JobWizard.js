import React from "react";
import { View, Button} from "react-native";
import glamorous from "glamorous-native";
import _ from "lodash";

export default context => {
  const AutoCompleteLocation = require("components/AutoCompleteLocation").default(
    context
  );

  const JobInfo = require("./JobInfo").default(context);
  const SectorList = require("components/SectorList").default(context);
  const JobEdit = require("./JobEdit").default(context);
  const CompanyInfo = require("./CompanyInfo").default(context);
  const DateItem = require("./Dates").default(context);

  const Header = glamorous.view({
    backgroundColor: "orange",
    padding: 16,
    marginBottom: 14
  });

  const HeaderTitle = glamorous.text({
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  });

  const wizardConfig = {
    header: ({ title }) => (
      <Header>
        <HeaderTitle>{title} </HeaderTitle>
      </Header>
    ),
    controls: ({ onPrevious, onNext, isFirst, isLast, nextAllowed = true }) => (
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          margin: 30
        }}
      >
        {!isFirst ? (
          <Button color="blue" title="Previous" onPress={onPrevious} />
        ) : (
          <View />
        )}
        {!isLast && (
          <Button
            disabled={!nextAllowed}
            color="blue"
            title="Next"
            onPress={onNext}
          />
        )}
      </View>
    ),
    steps: [
      {
        title: "Job Type",
        content: JobInfo,
        nextAllowed: ({ currentJob }) => currentJob.isValid()
      },
      {
        title: "Sector",
        content: ({ currentJob, store }) => (
          <SectorList
            onPress={sector => {
              currentJob.map.set("sector", sector);
              store.next();
            }}
          />
        )
      },
      {
        title: "Date",
        content: props => <DateItem {...props} />
      },
      {
        title: "Where ?",
        content: ({ currentJob, store }) => (
          <AutoCompleteLocation
            onLocation={location => currentJob.setLocation(location)}
            store={store}
          />
        ),
        nextAllowed: ({ currentJob }) => currentJob.hasLocation()
      },
      {
        title: "Company Info",
        content: CompanyInfo,
        nextAllowed: ({ currentJob }) => currentJob.isCompanyInfoValid()
      },
      {
        title: "Review",
        content: ({ onJobCreated, store, ...props }) => (
          <View>
            <Button
              color="blue"
              title="Create Job Post Now"
              onPress={() => {
                store.reset();
                onJobCreated();
              }}
            />
            <JobEdit {...props} />
          </View>
        )
      }
    ]
  };

  const Wizard = require("components/Wizard").default(context, wizardConfig);

  return Wizard.View;
};
