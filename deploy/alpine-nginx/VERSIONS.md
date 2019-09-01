# alpine-nginx

This file contains all software versions, that correspond to a version of this image itself. Read more about the [alpine-nginx image here][alpinenginx].

## Latest

Same as v3.0.0.

Usage: `smebberson/alpine-nginx` or `smebberson/alpine-nginx:latest`.

## v3.0.0

- [smebberson/alpine-base: v3.0.0][smebbersonalpinebase300]
- [nginx][nginx]: v1.8.1

Improvements:

- Updates to alpine-base `v3.0.0`.

Usage: `smebberson/alpine-nginx:3.0.0`.

## v2.1.1

- [smebberson/alpine-base: v1.2.0][smebbersonalpinebase120]
- [nginx][nginx]: v1.8.0

Improvements:

- Updates `finish` script to latest best practice for bringing down a container on crash.

Usage: `smebberson/alpine-nginx:2.1.1`.

## v2.1.0

- [smebberson/alpine-base: v1.2.0][smebbersonalpinebase120]
- [nginx][nginx]: v1.8.0

Usage: `smebberson/alpine-nginx:2.1.0`.

## v2.0.0

- [smebberson/alpine-base: v1.1.0][smebbersonalpinebase110]
- [nginx][nginx]: v1.8.0
- *breaking change*: nginx logs are now located at `/var/log/nginx/access.log` and `/var/log/nginx/error.log`

Usage: `smebberson/alpine-nginx:2.0.0`.

## v1.0.0

- [smebberson/alpine-base: v1.0.0][smebbersonalpinebase100]
- [nginx][nginx]: v1.8.0

Usage: `smebberson/alpine-nginx:1.0.0`.

[nginx]: http://nginx.org/
[alpinenginx]: https://github.com/smebberson/docker-alpine/tree/master/alpine-nginx
[smebbersonalpinebase100]: https://github.com/smebberson/docker-alpine/tree/alpine-base-v1.0.0/alpine-base
[smebbersonalpinebase110]: https://github.com/smebberson/docker-alpine/tree/alpine-base-v1.1.0/alpine-base
[smebbersonalpinebase120]: https://github.com/smebberson/docker-alpine/tree/alpine-base-v1.2.0/alpine-base
[smebbersonalpinebase300]: https://github.com/smebberson/docker-alpine/tree/alpine-base-v3.0.0/alpine-base
