# !/usr/bin/env bash

# install dependencies
sudo apt-get update
sudo apt-get install -y build-essential

# install node via nvm -  https://github.com/creationix/nvm
echo "Installing nvm..."
curl https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash

echo "source /home/vagrant/.nvm/nvm.sh" >> /home/vagrant/.profile
source /home/vagrant/.profile

nvm install 0.12.5
nvm alias default 0.12.5

# install global npm packages

npm install -g gulp@3.9.0
npm install -g shipit-cli@1.3.0