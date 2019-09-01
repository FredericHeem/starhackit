#!/bin/sh
set -e
ansible -i production.ini -m ping all
ansible-playbook -i production.ini app.yml -vv
