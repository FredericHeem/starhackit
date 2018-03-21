import _ from "lodash";
import { observable, action } from "mobx";

export default () =>
  observable({
    transaction: {},
    data: [],
    modal: false,
    getById(id) {
      return _.find(this.data, { id });
    },
    showTransaction: action(function(id) {
      this.transaction = this.getById(id);
      this.modal = true;
    }),
    hideTransaction: action(function() {
      this.modal = false;
    })
  });
