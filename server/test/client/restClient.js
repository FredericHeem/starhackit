"user strict";
var request = require('request')
, Promise = require('bluebird');


var Client = module.exports = function(config) {
  this.config = config || {};
  this.url = this.config.url || 'http://localhost:3000/api/';
}

function updateRequestWithKey(client, data){
  data.json = {};
  if(client.cookie){
    let jar = request.jar();
    jar._jar.rejectPublicSuffixes = false;
    jar.setCookie(client.cookie, client.url);
    data.jar = jar;
  } else {
    //console.log("no cookie")
  }

  return data;
}

Client.prototype._ops = function(ops, action, resCodes, param) {
  var me = this;
  var data = updateRequestWithKey(this, {});
  if(param){
    data.json = param;
  }
  data.method = ops;
  let requestFn = Promise.promisify(request);
  //console.log("_ops ", JSON.stringify(data));
  return requestFn(this.url + action, data)
  .spread(function(res, body) {
    //console.log("onResult statusCode: %s, body: %s", JSON.stringify(res), JSON.stringify(body))
    //console.log("headers ", JSON.stringify(res.headers))
    var rawCookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0] : undefined;
    //console.log("headers ", rawCookie);
    if(rawCookie){
      me.cookie = request.cookie(rawCookie);
      //console.log("me.cookie ", me.cookie);
    }

    if (resCodes.indexOf(res.statusCode) == -1){
      throw res;
    } else {
      return body
    }
  })
}

Client.prototype.get = function(action, param) {
  return this._ops("GET", action, [200], param);
}

Client.prototype.patch = function(action, param) {
  return this._ops("PATCH", action, [204], param);
}

Client.prototype.delete = function(action, param) {
  return this._ops("DELETE", action, [204], param);
}

Client.prototype.post = function(action, param) {
  return this._ops("POST", action, [200, 201, 204], param);
}

Client.prototype.activities = function() {
  return this.get('v1/activities');
}

Client.prototype.login = function(param) {
  var paramDefault = {
      username:this.config.username,
      password:this.config.password
  }

  return this.post('v1/auth/login', param || paramDefault);
}
