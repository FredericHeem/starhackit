## Docker images

The backend is packaged as docker image with this [Dockerfile](../Dockerfile)

Care has been taken to minimize the size of the image.

### Docker Build

To build a new image called *api*:

    server $ docker build . -t api

### Docker Tag

To tag an image as latest:

    $ docker tag api <YourDockerOrg>/api:latest

### Docker Push

Push the image to the docker repository:

    $ docker push <YourDockerOrg>/api:latest



