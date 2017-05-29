import { observable } from "mobx";
import { connect } from "react-redux";

export default function(context) {
  const ThemeView = require("./ThemeView").default(context);

  let stores;

  function Stores() {
    const sideBarStore = observable({
      open: true,
      toogle(){
        this.open = !this.open
      }
    });
    return {
      sideBar: sideBarStore
    };
  }
  function Containers() {
    return {
      theme() {
        const mapStateToProps = () => ({});
        return connect(mapStateToProps)(ThemeView);
      }
    };
  }

  function Routes(containers) {
    return {
      childRoutes: [
        {
          path: "view",
          component: containers().theme()
        }
      ]
    };
  }

  const containers = () => Containers(context);
  return {
    stores: () => stores,
    createStores: dispatch => {
      stores = Stores(dispatch, context);
    },
    containers,
    routes: (/*store*/) => Routes(containers)
  };
}
