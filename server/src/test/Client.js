let request = require("request");
let Promise = require("bluebird");
let _ = require("lodash");
let log;

export default class Client {
  constructor(config = {}, logOptions) {
    log = require("logfilename")(__filename, logOptions);
    this.config = config;
    this.url = this.config.url || "http://localhost:9000/api/";
  }
  _ops({ method, pathname, resCodes, param, formData, data }) {
    /*console.log(
      `${method} ${pathname} with %s to `,
      param ? JSON.stringify(param) : "no param",
      this.url
    );*/
    let me = this;
    const input = {
      url: this.url + pathname,
      method: method,
      jar: createJar(this),
      formData: formData,
      json: data ? data : true
    };
    if (this.jwt) {
      input.headers = {
        Authorization: "Bearer " + this.jwt
      };
    }
    return new Promise((resolve, reject) => {
      request(input, (error, res, body) => {
        if (error) reject(error);
        let cookiesIn = res.headers["set-cookie"];
        if (cookiesIn) {
          me.cookies = _.map(cookiesIn, cookie => {
            return request.cookie(cookie);
          });
        }
        if (resCodes.indexOf(res.statusCode) == -1) {
          reject(res);
        } else {
          resolve(body);
        }
      });
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
      data
    });
  }
  upload(pathname, formData) {
    return this._ops({
      method: "POST",
      pathname,
      resCodes: [200, 201, 204],
      formData
    });
  }
  login(param) {
    let paramDefault = {
      email: this.config.email,
      username: this.config.username,
      password: this.config.password
    };

    return this.post("v1/auth/login", param || paramDefault).then(body => {
      if (body.token) {
        log.debug("jwt token ", body.token);
        this.jwt = body.token;
      }
      return body;
    });
  }
}

function createJar({ cookies, url }) {
  if (cookies) {
    const jar = request.jar();
    jar._jar.rejectPublicSuffixes = false;
    _.each(cookies, cookie => {
      //console.log("cookie:" + cookie);
      jar.setCookie(cookie, url);
    });
    return jar;
  }
}
