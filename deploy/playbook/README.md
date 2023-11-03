# Deployment - Ansible

# Minimal Requirements

- [Ansible](http://www.ansible.com/)

> Ansible scripts are written for the Ubuntu 16.04 or higher

To install `ansible` with `brew`:

```
$ brew install ansible
```

Check the ansible version:

```
$ ansible --version
ansible 2.15.4

```

# What is installed and deployed:

Ansible enables the automation of the installation and configuration of the various stack components:
All components are dockerised

- Docker
- Postgres
- Certbot to generate and renew ssl certificate
- The node backend
- The frontend packaged inside an nginx container

# Configuration

The configuration depends on the _phase_ on the system: _dev_, _prod_, _uat_ etc ...
Each _phase_ has its own directory which contains the configuration files and the inventory of the remote machines.

The global configuration which is independent on the phase is at [group_vars/all/vars.yml](group_vars/all/vars.yml)

To set the production configuration parameters, create [group_vars/production.yml](group_vars/production.yml):

Then to change the remote machine connection settings (ip address, username, ssh key location), edit the production inventory: [production.ini](production.ini):

Copy the file [vault example](group_vars/all/vault.example.yml) to a file called _vault.yml_

The strict necessary is the docker configuration.

Please create a new access token from https://hub.docker.com/settings/security for _docker_hub_password_

[include](group_vars/all/vault.example.yml)

# Ansible roles download

Get ansible dependencies

    deploy/playbook$ ansible-galaxy install -r roles/requirements.yml

# Deployment to production

Check the connection to the production servers:

    $ ./deploy_prod.sh
