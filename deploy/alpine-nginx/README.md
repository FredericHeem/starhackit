# alpine-nginx

A Docker image for running [nginx][nginx], based on Alpine Linux.
This image belongs to a suite of images [documented here][dockeralpine].

## Features

This image features:

- [Alpine Linux][alpinelinux]
- [s6][s6] and [s6-overlay][s6overlay]
- [Nginx][nginx]

## Versions

- `3.0.0`, `latest` [(Dockerfile)](https://github.com/smebberson/docker-alpine/blob/alpine-nginx-v3.0.0/alpine-nginx/Dockerfile)
- `2.1.1` [(Dockerfile)](https://github.com/smebberson/docker-alpine/blob/alpine-nginx-v2.1.1/alpine-nginx/Dockerfile)
- `2.1.0` [(Dockerfile)](https://github.com/smebberson/docker-alpine/blob/alpine-nginx-v2.1.0/alpine-nginx/Dockerfile)
- `2.0.0` [(Dockerfile)](https://github.com/smebberson/docker-alpine/blob/alpine-nginx-v2.0.0/alpine-nginx/Dockerfile)
- `1.0.0` [(Dockerfile)](https://github.com/smebberson/docker-alpine/blob/alpine-nginx-v1.0.0/alpine-nginx/Dockerfile)

[See VERSIONS.md for image contents.](https://github.com/smebberson/docker-alpine/blob/master/alpine-nginx/VERSIONS.md)

## Usage

To use this image include `FROM smebberson/alpine-nginx` at the top of your `Dockerfile`, or simply `docker run -p 80:80 -p 443:443 --name nginx smebberson/alpine-nginx`.

Nginx logs (access and error logs) aren't automatically streamed to `stdout` and `stderr`. To review the logs, you can do one of two things:

Run the following in another terminal window:

```
docker exec -i nginx tail -f /var/log/nginx/access.log -f /var/log/nginx/error.log
```

or, in your `Dockerfile` symlink the Nginx logs to `stdout` and `stderr`:

```
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log
```

## Customisation

This container comes setup as follows:

- s6 will automatically start nginx for you.
- If nginx dies, so will the container.
- A basic nginx configuration and a simple default HTML file.

### HTML content

To alter the HTML content that nginx serves up (add your website files), add the following to your Dockerfile:

```
ADD /path/to/content /usr/html/
```

index.html is the default, but that's easily changed (see below).

### Nginx configuration

A basic nginx configuration is supplied with this image. But it's easy to overwrite:

- Create your own `nginx.conf`.
- In your `Dockerfile`, make sure your `nginx.conf` file is copied to `/etc/nginx/nginx.conf`.

**Make sure you start nginx without daemon mode, by including `daemon off;` in your nginx configuration, otherwise the container will constantly exit right after nginx starts.**

### Restarting nginx

If you're running another process to keep track of something down-stream (for example, automatically updating [nginx][nginx] proxy settings when a down-stream application server (nodejs, php, etc) restarts) execute the command `s6-svc -h /var/run/s6/services/nginx` to send a `SIGHUP` to nginx and have it reload its configuration, launch new worker process(es) using this new configuration, while gracefully shutting down the old worker processes.

### nginx crash

By default, if nginx crashes, the container will stop. This has been configured within `root/etc/services.d/nginx/finish`. This is so the host machine can handle any issues, and automatically restart it (the docker way, `docker run --autorestart`).

If you don't want this to happen, simply replace the `root/etc/services.d/nginx/finish` with a different file in your image. I like to `ln -s /bin/true /root/etc/services.d/nginx/finish` in those instances in which you don't need a finish script and want to have the service restarted by s6.

### Nginx configuration

If you need to, you can run a setup script before starting nginx. During your Dockerfile build process, copy across a file to `/etc/services.d/nginx/run` with the following (or customise it as required):

```
#!/usr/bin/with-contenv sh

if [ -e ./setup ]; then
./setup
fi

# Start nginx.
nginx -g "daemon off;"
```

## Example

An example of using this image can be found in [examples/user-nginx][example].

[alpinelinux]: https://www.alpinelinux.org/
[consul]: https://consul.io/
[s6]: http://www.skarnet.org/software/s6/
[s6overlay]: https://github.com/just-containers/s6-overlay
[dockeralpine]: https://github.com/smebberson/docker-alpine
[nginx]: http://nginx.org/
[example]: https://github.com/smebberson/docker-alpine/tree/master/examples/user-nginx
