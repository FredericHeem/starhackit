## Docker images


Edit [docker-compose.yml](../../docker-compose.yml) at the root of the project and change the docker organisation name and as well as the version of the images for the **api** and **ui**

Care has been taken to minimize the size of the image.

### Build

To build the **api** and **ui** images

    $ docker-compose build

### Push

Push the images to the docker repository:

    $ docker-compose push



