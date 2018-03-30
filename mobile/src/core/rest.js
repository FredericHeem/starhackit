import Axios from "axios";
import config from "../config";
import Qs from "qs";

function baseUrl(url) {
  const fullUrl = config.apiUrl + url;
  return fullUrl;
}

export default function(options = {}) {
  let _jwtSelector;

  function ajax(url, method, data, params) {
    console.log(
      `ajax url: ${baseUrl(url)}, method: ${method}, data ${JSON.stringify(
        data
      )}, params: ${JSON.stringify(params)}`
    );
    const headers = {
      "Content-Type": "application/json"
    };

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
      paramsSerializer: params => Qs.stringify(params, { arrayFormat: "repeat" }),
      withCredentials: true,
      headers,
      timeout: 30e3
    })
      .then(res => res.data)
      .catch(error => {
        console.log("ajax error: ", error);
        throw error;
      });
  }

  return {
    setJwtSelector(jwtSelector) {
      _jwtSelector = jwtSelector;
    },
    get(url, opts = {}) {
      return ajax(url, "GET", null, opts);
    },
    post(url, opts = {}) {
      return ajax(url, "POST", opts);
    },
    put(url, opts = {}) {
      return ajax(url, "PUT", opts);
    },
    del(url, opts = {}) {
      return ajax(url, "DELETE", opts);
    },
    patch(url, opts = {}) {
      return ajax(url, "PATCH", opts);
    }
  };
}
