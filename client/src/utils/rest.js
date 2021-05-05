import Axios from "axios";
import { stringify } from "qs";
import Debug from "debug";
const debug = new Debug("rest");

export default function ({ config, history }, options = {}) {
  const headersDefault = {
    "Content-Type": "application/json",
  };

  function ajax(url, method, data, params, headers = headersDefault) {
    debug(
      "ajax url: %s, method: %s, options %s, params: ",
      url,
      method,
      JSON.stringify(options),
      params
    );
    const jwt = localStorage.getItem("JWT");
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }

    return Axios({
      method,
      baseURL: config.apiUrl,
      url,
      params,
      data,
      withCredentials: true,
      headers,
      timeout: 30e3,
      paramsSerializer(params) {
        return stringify(params, { arrayFormat: "brackets" });
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        debug("ajax error: ", error);
        if (error.response) {
          if (
            [401, 403].includes(error.response.status) &&
            !location.pathname.includes("login")
          ) {
            history.push(`auth/login?nextPath=${location.pathname}`);
          }
        }
        throw error;
      });
  }

  return {
    get(url, data = {}) {
      return ajax(url, "GET", null, data);
    },
    post(url, data = {}) {
      return ajax(url, "POST", data);
    },
    upload(url, data) {
      return ajax(
        url,
        "POST",
        data,
        {},
        {
          "Content-Type": "multipart/form-data",
        }
      );
    },
    put(url, data = {}) {
      return ajax(url, "PUT", data);
    },
    del(url) {
      return ajax(url, "DELETE");
    },
    patch(url, data = {}) {
      return ajax(url, "PATCH", data);
    },
  };
}
