import Axios from "axios";
import Qs from "qs";
import config from "../config";
import Debug from "debug";

const debug = new Debug("rest");

function baseUrl(url) {
  const fullUrl = config.apiUrl + url;
  return fullUrl;
}

export default function(options = {}) {
  let _jwtSelector;
  const headersDefault = {
    "Content-Type": "application/json"
  };
  function ajax(url, method, data, params, headers = headersDefault) {
    debug(
      "ajax url: %s, method: %s, options %s, params: ",
      url,
      method,
      JSON.stringify(options),
      params
    );

    if (_jwtSelector) {
      const jwt = _jwtSelector();
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
        return Qs.stringify(params, { arrayFormat: "brackets" });
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
      _jwtSelector = jwtSelector;
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
