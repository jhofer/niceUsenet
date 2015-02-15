sudo rm /var/lib/mongodb/mongod.lock
sudo service mongod start
nodejs niceUsenet.js &
last_pid=$!
kill -KILL $last_pid
if ps -p $last_pid -o comm= | grep -qs '^niceUsenet$'; then
        kill -$signal $last_pid 2> /dev/null
        sleep(1000)
fi
