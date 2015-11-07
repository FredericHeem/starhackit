Deployment - Ansible
==========

# Requirements

* [VirtualBox](https://www.virtualbox.org/)
* [Vagrant](https://www.vagrantup.com)
* [Ansible](http://www.ansible.com/)

# What is installed and deployed:

Ansible enables the automation of the installation and configuration of the various stack components:

* Nginx - used as reverse proxy, https, DDOS protection etc ...
* Rabbitmq - the message queue.
* Nodejs
* The node api backend
* The frontend

The file [site.yml](site.yml) controls which roles are being deployed:

```
---
- hosts: all
  sudo: true
  vars_files:
    - 'vars/nginx-vars.yml'
  roles:
   - nodesource.node
   - mrlesmithjr.rabbitmq
   - api
   - nginx
```

# Configuration

The configuration depends on the *phase* on the system: *dev*, *prod*, *uat* etc ...
Each *phase* has its own directory which contains the configuration files and the inventory of the remote machines.

The global configuration which is independent on the phase is at [group_vars/all.yml](group_vars/all.yml)

```
app_name: starthackit
git_repo: https://github.com/FredericHeem/starhackit.git
git_version: master
api_dir: '{{home}}/{{app_name}}'
mail_signature: "The StarHackIt Team"
```

To edit the production configuration parameters, edit [prod/group_vars/server.yml](prod/group_vars/server.yml):

```
env_name: production
user: ubuntu
home: /home/ubuntu
node_env: production
website_url: "http://starhack.it"
mail_service: Mailgun
mail_from: "StarHackIt <notification@starhack.it>"
mail_user: postmaster@starhackit.mailgun.org
mail_password: 1b901d8d9a2806754225ad177fe93a10
facebook_client_id: 1643377549276547
facebook_client_secret: 1da6597bec02ca41f3950641c6e965a2
```

Then to change the remote machine connection settings (ip address, username, ssh key location), edit the production inventory: [prod/inventory](prod/inventory):

```
[server]
62.210.182.186 ansible_ssh_user=ops ansible_ssh_private_key_file=$HOME/.ssh/id_rsa_starthackitprod

```

# Deployment to vagrant local VM

First start the vagrant virtual machine where the whole stack will be installed:

    $ cd deploy/ansible
    $ vagrant up

Make sure _ansible_ can connect to the vagrant box:

    $ ansible -m ping available

To install everything on the vagrant machine:

    $ ansible-playbook site.yml -vv

The port 8000 is forwarded to the local machine so
the web server can be reach at `http://localhost:8000/`

To eventually change the forwarded port, edit [Vagrantfile](Vagrantfile)

To connect to the vagrant vm:

    $ vagrant ssh


# Deployment to production

Check the connection to the production servers:

    $ ansible -i prod -m ping all

To install everything on the servers:

    $ ansible-playbook -i prod site.yml -vv
