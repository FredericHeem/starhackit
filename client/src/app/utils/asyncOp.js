import isString from 'lodash/isString';
import React from 'react';
import { observable, action } from 'mobx';
import alert from "components/alert";

function createHttpError(payload = {}) {
  const { response = {} } = payload;
  function name() {
    if (isString(response)) {
      return response;
    }
    return response.statusText;
  }
  function message() {
    const data = response.data;
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
    message: message(),
  };
  return errorOut;
}

export default context => {
    const Alert = alert(context);
    return function create(api) {
        const store = observable({
            loading: false,
            data: null,
            error: null,
 
            fetch: action(async function (input) {
                try {
                    store.loading = true;
                    store.error = null;
                    //console.log("fetch ");
                    const response = await api(input);
                    store.data = response;
                    //console.log("fetch response ", response);
                    return response;
                } catch (error) {
                    //console.error("fetch error ", error);
                    store.error = error;
                    const { response : {status} } = error;
                    //console.error("fetch status ", status);
                    if (![401, 422].includes(status)) {
                        context.alertStack.add(<Alert.Danger {...createHttpError(error)} />)
                    }
                    throw error;
                } finally {
                    store.loading = false
                }
            })
        })
        return store;
    }
}