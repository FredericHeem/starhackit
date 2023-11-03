#!/bin/sh
set -e
ansible -i demo.ini -m ping all
ansible-playbook -i demo.ini server.yml -vv
ansible-playbook -i demo.ini app.yml -vv
