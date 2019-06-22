import Axios from "axios";
import {stringify} from "qs";
import Debug from "debug";
const debug = new Debug("rest");

export default function(config = {}, options = {}) {
  let jwtSelectorCurrent;
  const headersDefault = {
    "Content-Type": "application/json"
  };

  function baseUrl(url) {
    const fullUrl = config.apiUrl + url;
    return fullUrl;
  }
  function ajax(url, method, data, params, headers = headersDefault) {
    debug(
      "ajax url: %s, method: %s, options %s, params: ",
      url,
      method,
      JSON.stringify(options),
      params
    );

    if (jwtSelectorCurrent) {
      const jwt = jwtSelectorCurrent();
      if (jwt) {
        headers.Authorization = `Bearer ${jwt}`;
      }
    }

    return Axios({
      method,
      url: baseUrl(url),
      params,
      data,
      withCredentials: true,
      headers,
      timeout: 30e3,
      paramsSerializer(params) {
        return stringify(params, { arrayFormat: "brackets" });
      }
    })
      .then(res => res.data)
      .catch(error => {
        debug("ajax error: ", error);
        throw error;
      });
  }

  return {
    setJwtSelector(jwtSelector) {
      jwtSelectorCurrent = jwtSelector;
    },
    get(url, data = {}) {
      return ajax(url, "GET", null, data);
    },
    post(url, data = {}) {
      return ajax(url, "POST", data);
    },
    upload(url, data) {
      return ajax(url, "POST", data, {}, {
        "Content-Type": "multipart/form-data"
      });
    },
    put(url, data = {}) {
      return ajax(url, "PUT", data);
    },
    del(url) {
      return ajax(url, "DELETE");
    },
    patch(url, data = {}) {
      return ajax(url, "PATCH", data);
    }
  };
}
