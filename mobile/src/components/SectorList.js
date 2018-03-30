import React from "react";
import { Text } from "react-native";
import { observer } from "mobx-react";

export default context => {
  const List = require("components/List").default(context);

  const sectorItems = [
    "Bar - Restaurants - Clubs",
    "Catering - Events",
    "Construction",
    "Delivery -Drivers - Couriers",
    "Electricity - Plumbing - AC",
    "Handling - Moving - Repair",
    "Hotels - Motels - Resorts",
    "Housekeeping - Janitorial",
    "Pool - Landscaping",
    "Retail - Sales",
    "Sport - Fitness - Spa",
    "Valet - Security - Guard",
    "Wholesale - Manufacturing",
    "Web - Graphic Design",
    "Other"
  ];

  return observer(({ onPress }) => (
      <List
        onPress={onPress}
        onKey={item => item}
        items={sectorItems}
        renderItem={item => <Text style={{fontSize: 16}}>{item}</Text>}
      />
  ));
};
