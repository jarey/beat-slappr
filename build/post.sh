#!/bin/bash

package=$1
server=$2

if [ $server == "lab" ]
then
    serverPath="/var/www"
    scp -P9128 $package root@haigo.dyndns.org:$serverPath
    echo ""
    echo "Posted to $server:$serverPath"
    echo ""
elif [ $server == "live" ]
then
    serverPath="/var/www/patternsketch.com"
    scp $package root@patternsketch.com:$serverPath
    echo ""
    echo "Posted to $server:$serverPath"
    echo ""
else
    echo "Invalid Server."
fi
