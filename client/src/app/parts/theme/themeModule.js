import { observable } from "mobx";

export default function() {
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

  const stores = Stores();
  return {
    stores: () => stores
  };
}
