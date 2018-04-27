import React from "react";
import glamorous from "glamorous-native";

export default context => {
  const View = require("components/View").default(context);
  const Text = require("components/Text").default(context);
  const Avatar = require("components/Avatar").default(context);

  const PictureView = glamorous(View)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: 0,
    padding: 16
  });

  const ProfileHeader = ({ url, username, ...props }) => (
    <PictureView primary shadow {...props}>
      <Avatar url={url} />
      <Text primaryOnPrimary large>
        {username}
      </Text>
    </PictureView>
  );
  return ProfileHeader;
};
