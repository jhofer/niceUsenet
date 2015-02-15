
while true; do
  sudo rm /var/lib/mongodb/mongod.lock
  sudo service mongod start
  nodejs niceUsenet.js &
  last_pid=$!
  sleep 30m
  if ps -p $last_pid -o comm= | grep -qs '^niceUsenet$'; then
          kill -$signal $last_pid 2> /dev/null
          sleep 10s
  fi
done
