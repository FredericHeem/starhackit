
import {observable, action} from "mobx";
import Debug from 'debug';
const debug = new Debug("restTableStore");

export default (context, {getData}) => {

  const store = observable({
    loading: false,
    count: 0,
    data: [],
    error: null,
    pagination: {
      page: 1,
      perPage: 100
    },
    setData(data){
      this.data = data;
    },
    selectPage: action(async function (page) {
      debug('onSelectPage ', page);
      if (page <= 0) {
        return;
      }
      this.loading = true;
      store.error = null;

      try {
        const result = await getData({
          offset: this.pagination.perPage * (page - 1),
          limit: this.pagination.perPage
        })
        debug("onSelectPage length ", result.data.length)
        this.pagination.page = page;
        this.count = result.count;
        this.data = result.data;
        this.loading = false;
      } catch (error) {
        debug('onSelectPage error ', error);
        this.error = error;
        this.loading = false;
      }
    }),
  })

  return store;
}
