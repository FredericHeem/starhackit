import isString from "lodash/isString";
import { observable, action } from "mobx";

function createHttpError(payload = {}) {
  const { response = {} } = payload;
  function name() {
    if (isString(response)) {
      return response;
    }
    return response.statusText;
  }
  function message() {
    const { data } = response;
    if (isString(data)) {
      return data;
    } else if (data && isString(data.message)) {
      return data.message;
    } else if (payload.message) {
      return payload.message;
    }
  }
  const errorOut = {
    name: name(),
    code: response.status,
    message: message()
  };
  return errorOut;
}

export default () =>
  //const Alert = alert(context);
  function create(api, options = {}) {
    const store = observable({
      loading: false,
      data: undefined,
      error: undefined,
      execute: action(async function(fn, input) {
        try {
          store.loading = true;
          store.error = null;
          const response = await fn(input);
          //console.log("fetch response ", response);
          if (options.transform) {
            store.data = options.transform(response);
          } else {
            store.data = response;
          }

          return response;
        } catch (error) {
          console.log("fetch error ", error);
          store.error = error;
          const { response: { status } } = error;
          console.log("fetch status ", status);
          if (![401, 422].includes(status)) {
            /*context.alertStack.add(
              <Alert.Danger {...createHttpError(error)} />
            );*/
          }
          throw error;
        } finally {
          store.loading = false;
        }
      }),
      fetch: action(async function(input) {
        return store.execute(api, input);
      })
    });
    return store;
  };
