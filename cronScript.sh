while true; do
  sudo rm /var/lib/mongodb/mongod.lock
  sudo service mongod start
  nodejs niceUsenet.js &
  sleep 1h
  last_pid=$!
  kill -KILL $last_pid
  if ps -p $last_pid -o comm= | grep -qs '^niceUsenet$'; then
          kill -$signal $last_pid 2> /dev/null
          sleep 1m
  fi
done
