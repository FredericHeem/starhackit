docker build -t alpine-nginx .
docker tag alpine-nginx fredericheem/alpine-nginx:latest
docker push fredericheem/alpine-nginx:latest