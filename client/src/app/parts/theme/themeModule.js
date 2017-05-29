import { observable } from "mobx";

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
        return ThemeView;
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
