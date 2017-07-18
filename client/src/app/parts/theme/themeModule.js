import { createElement as h } from 'react';
import { observable } from "mobx";

export default function(context) {
  const ThemeView = require("./ThemeView").default(context);

  function Stores() {
    const sideBarStore = observable({
      open: false,
      toogle(){
        this.open = !this.open
      }
    });
    return {
      sideBar: sideBarStore
    };
  }

  function Routes(stores) {
    return [
        {
          path: "view",
          component: () => h(ThemeView, { store: stores.sideBar })
        }
      ]
  }
  const stores = Stores();
  return {
    stores: () => stores,
    routes: () => Routes(stores)
  };
}
