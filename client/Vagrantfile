# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "bento/debian-7.8-i386"
  config.vm.box_version = "2.2.0"
  config.vm.network :forwarded_port, guest: 22, host: 3020, id: 'ssh'

  # 192.168.30.20 - UI server
  # 192.168.30.21 - api server
  config.vm.network "private_network", ip: "192.168.30.20"

  # disable the default vagrant shared folder file
  config.vm.synced_folder ".", "vagrant", disabled: true

  config.vm.provider "virtualbox" do |vb|
      # Customize the amount of memory on the VM:
      vb.memory = "384"
      vb.cpus = 1
  end

  # provision VM
  config.vm.provision "shell", path: "provision/base.sh", privileged: false

 if RUBY_PLATFORM =~ /mingw/
   config.vm.provision "shell", path: "provision/client.sh", privileged: false
 end


end
