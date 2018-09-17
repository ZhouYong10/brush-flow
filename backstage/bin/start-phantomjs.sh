#!/bin/sh

#  nohup ./start-phantomjs.sh &

while true
do
stillRunning=$(ps -ef |grep "phantomjs --ignore-ssl-errors=true --ssl-protocol=any phantomjs-server.js" |grep -v "grep")
if [ "$stillRunning" ] ; then
# echo "phantomjs service was already started."
else
echo "phantomjs service was not started"
echo "Starting service ..."
nohup phantomjs --ignore-ssl-errors=true --ssl-protocol=any phantomjs-server.js &
echo "phantomjs service was exited!"
fi
sleep 1800
done