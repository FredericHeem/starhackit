Deployment
==========

# Requirements

* [VirtualBox](https://www.virtualbox.org/)
* [Vagrant](https://www.vagrantup.com)
* [Ansible](http://www.ansible.com/)


# Local deployment

    $ cd deploy/ansible
    $ vagrant up

Make sure _ansible_ can connect to the vagrant box:

    $ ansible -m ping dev

To install everything on the vagrant machine:

    $ ansible-playbook -i dev site.yml -vv
