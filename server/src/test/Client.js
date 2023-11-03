const Axios = require("axios");
let log;

class Client {
  constructor(config = {}, logOptions) {
    log = require("logfilename")(__filename, logOptions);
    this.config = config;
    this.url = this.config.url || "http://localhost:9000/api/";
    this.axios = Axios.create({
      baseURL: this.url,
      timeout: 3000e3,
      withCredentials: true,
    });
  }
  _ops({ method, pathname, resCodes, formData, data }) {
    let headers = {};

    if (this.jwt) {
      headers.Authorization = `Bearer ${this.jwt}`;
    }

    if (formData) {
      headers = { ...headers, ...formData.getHeaders() };
    }
    return this.axios
      .request({
        method,
        url: pathname,
        headers,
        data,
      })
      .then((res) => {
        //console.log(JSON.stringify(res.data, null, 4));
        return res.data;
      });
  }

  get(pathname, param) {
    return this._ops({ method: "GET", pathname, resCodes: [200], param });
  }

  patch(pathname, data) {
    return this._ops({ method: "PATCH", pathname, resCodes: [200, 204], data });
  }

  put(pathname, data) {
    return this._ops({ method: "PUT", pathname, resCodes: [200, 204], data });
  }

  delete(pathname) {
    return this._ops({ method: "DELETE", pathname, resCodes: [204] });
  }

  post(pathname, data) {
    return this._ops({
      method: "POST",
      pathname,
      resCodes: [200, 201, 204],
      data,
    });
  }
  upload(pathname, formData) {
    return this._ops({
      method: "POST",
      pathname,
      resCodes: [200, 201, 204],
      formData,
      data: formData,
    });
  }
  login(param) {
    let paramDefault = this.config;
    return this.post("v1/auth/login", param || paramDefault).then((body) => {
      if (body.token) {
        log.debug("jwt token ", body.token);
        this.jwt = body.token;
      }
      return body;
    });
  }
}

module.exports = Client;
