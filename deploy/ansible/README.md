Deployment - Ansible
==========

# Minimal Requirements

* [Ansible](http://www.ansible.com/)

Eventually install `vagrant` and `virtualbox` if you desire to install a prod like system on your local machine:

* [VirtualBox](https://www.virtualbox.org/)
* [Vagrant](https://www.vagrantup.com)


> Ansible scripts are written for the Ubuntu 16.04 or higher 

To install `ansible` with `brew`:
 
 ```
$ brew install ansible
 ```

The ansible scripts has been tested with version 2.4:
 ```
 $ ansible --version
ansible 2.4.3.0

 ```
# What is installed and deployed:

Ansible enables the automation of the installation and configuration of the various stack components:

* Nginx - used as reverse proxy, https, DDOS protection etc ...
* Nodejs
* Redis
* Certbot to generate and renew ssl certificate
* The node api backend
* The frontend

The file [site.yml](site.yml) controls which roles are being deployed

# Configuration

The configuration depends on the *phase* on the system: *dev*, *prod*, *uat* etc ...
Each *phase* has its own directory which contains the configuration files and the inventory of the remote machines.

The global configuration which is independent on the phase is at [group_vars/all.yml](group_vars/all.yml)

```
app_name: starhackit
git_repo: https://github.com/FredericHeem/starhackit.git
git_version: master
api_dir: '{{home}}/{{app_name}}'
mail_signature: "The StarHackIt Team"
```

To set the production configuration parameters, create [prod/group_vars/server.yml](prod/group_vars/server.yml):

```

env_name: production
user: ubuntu
home: /home/ubuntu
node_env: production
server_name: starhack.it
protocol: https
ssl_admin_email: security@starhack.it
website_url: "https://starhack.it"
db_name: "main"
db_user: "postgres"
db_password: "_Password123!"
redis_url: "redis://localhost:6379"
mail_service: 'Mailgun'
mail_from: "StarHackIt <notification@starhack.it>"
mail_user: ''
mail_password: ""
facebook_client_id: ""
facebook_client_secret: ""
google_client_id: ""
google_client_secret: ""

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

    $ ansible -i dev -m ping all

To install everything on the vagrant machine:

    $ ansible-playbook -i dev site.yml -vv

The port 80 is forwarded to the local machine so
the web server can be reach at `http://localhost:8081/`

To eventually change the forwarded port, edit [Vagrantfile](Vagrantfile)

To connect to the vagrant vm:

    $ vagrant ssh


# Deployment to production

Check the connection to the production servers:

    $ ansible -i prod -m ping all

To install everything on the servers:

    $ ansible-playbook -i prod site.yml -vv
