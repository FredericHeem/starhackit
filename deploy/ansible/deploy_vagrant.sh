#!/bin/sh
vagrant up
ansible-playbook -i dev site.yml -vv
