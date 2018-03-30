import { createStackNavigator } from "react-navigation";

const titleMap = {
  Candidate: "Find a Job",
  Recruiter: "Hire"
};

export default context =>
  createStackNavigator(
    {
      Landing: {
        screen: require("./Landing").default(context),
        navigationOptions: () => ({
          header: null
        })
      },
      LoginMaster: {
        screen: require("./LoginMaster").default(context),
        navigationOptions: ({ navigation }) => ({
          header: undefined,
          title: titleMap[navigation.state.params.app]
        })
      }
    },
    {
      navigationOptions: {
        header: null
      }
    }
  );
