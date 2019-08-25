Deployment - Ansible
==========

# Minimal Requirements

* [Ansible](http://www.ansible.com/)

> Ansible scripts are written for the Ubuntu 16.04 or higher 

To install `ansible` with `brew`:
 
 ```
$ brew install ansible
 ```

The ansible scripts has been tested with version 2.4:
 ```
 $ ansible --version
ansible 2.8.4

 ```
# What is installed and deployed:

Ansible enables the automation of the installation and configuration of the various stack components:
All components are dockerised

* Nginx - used as reverse proxy, https, DDOS protection etc ...
* Nodejs
* Redis
* Postgres
* Certbot to generate and renew ssl certificate
* The node api backend
* The frontend

# Configuration

The configuration depends on the *phase* on the system: *dev*, *prod*, *uat* etc ...
Each *phase* has its own directory which contains the configuration files and the inventory of the remote machines.

The global configuration which is independent on the phase is at [group_vars/all/vars.yml](group_vars/all/vars.yml)

To set the production configuration parameters, create [prod/group_vars/server.yml](prod/group_vars/server.yml):

Then to change the remote machine connection settings (ip address, username, ssh key location), edit the production inventory: [prod/inventory](prod/inventory):

# Deployment to production

Check the connection to the production servers:

    $ ./deploy_prod.sh