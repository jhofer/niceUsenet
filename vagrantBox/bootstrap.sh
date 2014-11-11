#!/usr/bin/env bash
echo =====================================
echo update ubuntu stuff
echo =====================================
sudo apt-get update
sudo apt-get upgrade


echo =====================================
echo install curl
echo =====================================
sudo apt-get  --yes --force-yes install curl

echo =====================================
echo install node and npm
echo =====================================
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get  --yes --force-yes install nodejs
sudo npm  --yes --force-yes install -g npm@latest
sudo apt-get  --yes --force-yes install build-essential #such as those that require building from source

echo =====================================
echo install python 2.6
echo =====================================
sudo apt-get install python-software-properties
sudo add-apt-repository ppa:fkrull/deadsnakes
sudo apt-get  update
sudo apt-get  --yes --force-yes install python2.6

echo =====================================
echo install phantom for virtual browser phantomjs
echo =====================================
sudo apt-get  --yes --force-yes install libfontconfig
sudo npm install phantomjs -g

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
sudo rvm requirements
sudo rvm install ruby
rvm use ruby --default
sudo rvm rubygems current
sudo gem update --system
sudo gem install compass



