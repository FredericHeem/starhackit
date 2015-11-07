#!/bin/sh
set -e
ansible -i prod -m ping all
ansible-playbook -i prod site.yml -vv
