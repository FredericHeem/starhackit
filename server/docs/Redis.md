## Redis session store

*Redis* can be used to quickly store and retrieve session data. This allows for zero down time in production when the api server is restarted.
*Redis* is installed and started by docker.

# Install & Start

    $ npm run docker:up

    $ docker ps

Now check the name of the redis container to display the logs:

  ```
$ docker logs server_redis_1
[fix-attrs.d] applying owners & permissions fixes...
[fix-attrs.d] 00-runscripts: applying... 
[fix-attrs.d] 00-runscripts: exited 0.
[fix-attrs.d] done.
[cont-init.d] executing container initialization scripts...
[cont-init.d] done.
[services.d] starting services
[services.d] done.
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 2.8.23 (0d7b4321/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                   
 (    '      ,       .-`  | `,    )     Running in stand alone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 86
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           http://redis.io        
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

[86] 19 Mar 10:58:11.964 # Server started, Redis version 2.8.23
[86] 19 Mar 10:58:11.965 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
[86] 19 Mar 10:58:11.965 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
[86] 19 Mar 10:58:11.966 * The server is now ready to accept connections on port 6379
  ```
  

## Configuration
Here is how to configure Redis:

```
"redis":{
  "url": "//localhost:7379"
},
```






