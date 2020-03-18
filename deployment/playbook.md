# Deploy docker images with Ansible

## Deployment - Ansible

## Minimal Requirements

* [Ansible](http://www.ansible.com/)

> Ansible scripts are written for the Ubuntu 18.04 or higher

To install `ansible` with `brew`:

```text
$ brew install ansible
```

Check the ansible version:

```text
 $ ansible --version
ansible 2.9.6
```

## What is installed and deployed:

Ansible enables the automation of the installation and configuration of the various stack components: All components are dockerised

* Nginx - used as reverse proxy, https, DDOS protection etc ...
* Nodejs
* Redis
* Postgres
* Certbot to generate and renew ssl certificate
* The node api backend
* The frontend

## Configuration

The configuration depends on the _phase_ on the system: _dev_, _prod_, _uat_ etc ... Each _phase_ has its own directory which contains the configuration files and the inventory of the remote machines.

The global configuration which is independent on the phase is at [group\_vars/all/vars.yml](https://github.com/FredericHeem/starhackit/tree/8096c83cbe8b63acf4f38062192b4b67714c2cb1/deploy/playbook/group_vars/all/vars.yml)

To set the production configuration parameters, create [group\_vars/production.yml](https://github.com/FredericHeem/starhackit/tree/8096c83cbe8b63acf4f38062192b4b67714c2cb1/deploy/playbook/group_vars/production.yml):

Then to change the remote machine connection settings \(ip address, username, ssh key location\), edit the production inventory: [production.ini](https://github.com/FredericHeem/starhackit/tree/8096c83cbe8b63acf4f38062192b4b67714c2cb1/deploy/playbook/production.ini):

Get ansible dependencies

```text
deploy/playbook$ ansible-galaxy install -r roles/requirements.yml
```

## Deployment to production

Check the connection to the production servers:

```text
$ ./deploy_prod.sh
```

