## Redis session store

*Redis* can be used to quickly store and retrieve session data. This allows for zero down time in production when the api server is restarted.
*Redis* is installed via docker.

Here is how to configure Redis:

```
"redis":{
  "url": "//localhost:6379"
},
```






