## Docker Compose

_docker-compose_ manages the docker containers for the various services such as Redis and Postgres on the local machine.

The file [docker-compose.yml](../docker-compose.yml) defines all dependencies to run the project

    # cd server
    # npm run docker:up

To check that the containers are running:

```
# docker ps
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS              PORTS                    NAMES
e16e6b12b427        postgres:10-alpine        "docker-entrypoint.s…"   47 hours ago        Up 47 hours         0.0.0.0:6432->5432/tcp   server_pg_1
0b24afd9defe        smebberson/alpine-redis   "/init"                  47 hours ago        Up 47 hours         0.0.0.0:7379->6379/tcp   server_redis_1
```

Getting a container logs:

    $ docker logs server_pg_1

Destroy all containers and volumes:

    $ npm run docker:destroy
