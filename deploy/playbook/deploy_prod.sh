#!/bin/sh
set -e
ansible -i production.ini -m ping all
ansible-playbook -i production.ini pre.yml -vv
ansible-playbook -i production.ini server.yml -vv
ansible-playbook -i production.ini app.yml -vv
