import Axios from 'axios';
import Qs from 'qs';
import config from '../config';
import Debug from 'debug';

const debug = new Debug("rest");

function baseUrl(url) {
    const fullUrl = config.apiUrl +  url;
    return fullUrl;
}

export default function(options = {}){
  let _jwtSelector;

  function ajax(url, method, data, params) {
      debug("ajax url: %s, method: %s, options %s, params: ", url, method, JSON.stringify(options), params);
      const headers = {
          'Content-Type': 'application/json'
      }

      if(_jwtSelector){
          const jwt = _jwtSelector();
          if(jwt){
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
              return Qs.stringify(params, {arrayFormat: 'brackets'});
          }
      }).then(res => res.data).catch(error => {
          debug("ajax error: ", error);
          throw error
      });
  }

  return {
    setJwtSelector(jwtSelector){
        _jwtSelector = jwtSelector
    },
    get(url, options = {}) {
        return ajax(url, 'GET', null, options);
    },
    post(url, options = {}) {
        return ajax(url, 'POST', options);
    },
    put(url, options = {}) {
        return ajax(url, 'PUT', options);
    },
    del(url, options = {}) {
        return ajax(url, 'DELETE', options);
    },
    patch(url, options = {}) {
       return ajax(url, 'PATCH', options);
    }
  }
}
