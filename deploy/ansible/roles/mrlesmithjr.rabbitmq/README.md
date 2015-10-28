Role Name
=========

Installs rabbitmq https://www.rabbitmq.com/ (Configurable...HA and Clustering ready)

Requirements
------------

Ensure hostnames are resolvable prior to clustering...either update /etc/hosts or ensure DNS is working.

Role Variables
--------------

````
config_rabbitmq_ha: false  #defines if rabbitmq ha should be configured...define here or in group_vars/group
enable_rabbitmq_clustering: false  #defines if setting up a rabbitmq cluster...define here or in group_vars/group
erlang_cookie: LSKNKBELKPSTDBBCHETL  #define erlang cookie for cluster...define here or in group_vars/group
erlang_cookie_file: /var/lib/rabbitmq/.erlang.cookie
rabbitmq_config:
  - queue_name: logstash
    durable: true
    exchange_name: logstash
    type: direct
    routing_key: logstash
    tags: 'ha-mode=all,ha-sync-mode=automatic'
rabbitmq_master: []  #defines the inventory host that should be considered master...define here or in group_vars/group
````

example...
group_vars/rabbitmq-cluster-nodes
````
---
enable_rabbitmq_clustering: true
config_rabbitmq_ha: false
rabbitmq_master: ans-test-1
````

Dependencies
------------

A list of other roles hosted on Galaxy should go here, plus any details in regards to parameters that may need to be set for other roles, or variables that are used from other roles.

Example Playbook
----------------

Including an example of how to use your role (for instance, with variables passed in as parameters) is always nice for users too:

    - hosts: servers
      roles:
         - { role: mrlesmithjr.rabbitmq }

License
-------

BSD

Author Information
------------------

Larry Smith Jr.
- @mrlesmithjr
- http://everythingshouldbevirtual.com
- mrlesmithjr [at] gmail.com
