#!/bin/bash

package=$1
server=$2

if [ $server == "lab" ]
then
    serverPath="/var/www"
    scp -P9128 $package root@haigo.dyndns.org:$serverPath
    ssh root@haigo.dyndns.org -p9128 "cd $serverPath/patternsketch; mv hotlinks.db.sqlite ../;rm -dr *; mv ../hotlinks.db.sqlite .; mv ../$package .; tar -xzf $package; rm $package; ./admin/kits/kit-sync.php"
    echo ""
    echo "Posted to $server:$serverPath"
    echo ""
elif [ $server == "live" ]
then
    serverPath="/var/www/patternsketch.com"
    scp $package root@patternsketch.com:$serverPath
    ssh root@patternsketch.com "cd $serverPath/html; mv hotlinks.db.sqlite ../; rm -dr *; mv ../hotlinks.db.sqlite .; mv ../$package .; tar -xzf $package; rm $package; ./admin/kits/kit-sync.php"
    echo ""
    echo "Posted to $server:$serverPath"
    echo ""
else
    echo "Invalid Server."
fi
