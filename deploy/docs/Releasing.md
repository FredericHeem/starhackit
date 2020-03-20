# Releasing a new version

## Change version

Change the version of the backend and frontend in the following files:

- [client/package.json](../../client/package.json)
- [server/package.json](../../client/package.json)
- [docker-compose.yml](../../docker-compose.yml)
- [deploy/playbook/group_vars/all/vars.yml](../playbook/group_vars/all/vars.yml)

## Version branch

Create a new branch, commit and push to the repository.

```
    $ git checkout -b v10.2.1
    $ git commit -m"v10.2.1" .
    $ git push origin  v10.2.1
```

Create a pull request, ask for review and merge to the master branch

Check out the master branch and pull the latest

    $ git checkout master
    $ git pull

The npm version script:

    $ npm version 10.2.1

will perform the following tasks:

- build the docker images for backend and frontend
- push the images to the docker repository
- Change and commit the version on the root package.json
- tag the git repository with new version
- push the new git tag

You are now ready to [deploy with Ansible](../playbook/README.md)
