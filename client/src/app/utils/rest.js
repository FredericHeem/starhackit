import Axios from 'axios';
import Qs from 'qs';
import config from '../config';
import Debug from 'debug';

let debug = new Debug("rest");

function baseUrl( url ) {
    var fullUrl = config.apiUrl +  url;
    return fullUrl;
}

export default function(options = {}){
  let _jwtSelector;

  function ajax( url, method, data, params ) {
      debug("ajax url: %s, method: %s, options %s, params: ", url, method, JSON.stringify(options), params);
      let headers = {
          'Content-Type': 'application/json'
      }

      if(_jwtSelector){
          let jwt = _jwtSelector();
          if(jwt){
              headers.Authorization = 'Bearer ' + jwt;
          }
      }

      return Axios({
          method: method,
          url: baseUrl(url),
          params: params,
          data: data,
          withCredentials: true,
          headers: headers,
          timeout: 30e3,
          paramsSerializer: function(params) {
              return Qs.stringify(params, {arrayFormat: 'brackets'});
          }
      }).then(res => {
          return res.data;
      }).catch(error => {
          debug("ajax error: ", error);
          throw error
      });
  }

  return {
    setJwtSelector(jwtSelector){
        _jwtSelector = jwtSelector
    },
    get( url, options = {} ) {
        return ajax( url, 'GET', null, options );
    },
    post( url, options = {} ) {
        return ajax( url, 'POST', options );
    },
    put( url, options = {} ) {
        return ajax( url, 'PUT', options );
    },
    del( url, options = {} ) {
        return ajax( url, 'DELETE', options );
    },
    patch( url, options = {} ) {
       return ajax( url, 'PATCH', options );
    }
  }
}
