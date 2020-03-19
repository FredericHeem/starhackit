# HTTP Server

[Koa](https://koajs.com/), the successor of *express* is being used in this project.


## Configuration

Here is the (koa configuration)[../config/default.json]:

```
"koa": {
    "port": 9000,
    "apiBasePath": "/api/v1/",
    "cookieSecret": ["your-super-session-secret"],
    "staticContent": ["build"],
    "logger": true,
    "cors":{
      "credentials": true
    }
  },
```


