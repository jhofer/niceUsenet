#!/usr/bin/env bash
echo =====================================
echo update ubuntu stuff
echo =====================================
sudo apt-get update
sudo apt-get upgrade --yes --force-yes


echo =====================================
echo install curl
echo =====================================
sudo apt-get  --yes --force-yes install curl

echo =====================================
echo install git
echo =====================================
sudo apt-get --yes --force-yes  install git-core


echo =====================================
echo install python 2.6
echo =====================================

sudo add-apt-repository ppa:fkrull/deadsnakes --yes
sudo apt-get update
sudo apt-get  --yes --force-yes install sudo apt-get install python-software-properties python2.6 g++ make

echo =====================================
echo install node and npm
echo =====================================
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get  --yes --force-yes install nodejs
sudo npm  --yes --force-yes install -g npm@latest
sudo apt-get  --yes --force-yes install build-essential #such as those that require building from source




echo =====================================
echo install phantom for virtual browser phantomjs
echo =====================================
sudo apt-get  --yes --force-yes install libfontconfig
sudo npm install phantomjs -g
sudo npm install casperjs -g


echo =====================================
echo install mongodb
echo =====================================
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install  --yes --force-yes mongodb-org

echo =====================================
echo install global node modules
echo =====================================
sudo npm install -g grunt-cli
sudo npm install -g bower
sudo npm install forever -g

echo =====================================
echo install ruby and compass
echo =====================================
gpg --keyserver hkp://keys.gnupg.net --recv-keys D39DC0E3
sudo \curl -L https://get.rvm.io | bash -s stable
source ~/.rvm/scripts/rvm
rvm requirements
rvm install ruby
rvm use ruby --default
rvm rubygems current
sudo apt-get install ruby-dev   --yes --force-yes
gem update --system
gem install compass


echo =====================================
echo link node_modules to vm
echo =====================================
sudo mkdir ~/node_modules
sudo ln -s ~/node_modules /project/node_modules



echo =====================================
echo install project dependencies
echo =====================================
cd /project && sudo npm install
cd /project && bower install  --yes --force-yes
cd /project && sudo npm install phantom



