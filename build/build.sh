#!/bin/bash

buildArr=( lab live )

if [ -d build ]
then
    echo ""
    echo "Removing build directory..."
    echo ""

    rm -dr build
fi

echo ""
echo "Creating build directory..."
echo ""

mkdir build

echo ""
echo "Copying files..."
echo ""

rsync -a --exclude 'build' --exclude '.git' --exclude 'todo.txt' ../ build

echo ""
echo "Moving config files..."
echo ""

mkdir build/config
mv build/config.* build/config

#echo "Minifying JavaScript..."
#./tools/minify.php -i "build/index.js build/reference/js/fader.js build/reference/js/hijax2.js" -o "build/index.js" -delete

echo ""
echo "Setting build directory permissions..."
echo ""

chmod -R 777 build

if [ ! -d packages ]
then
    mkdir packages
fi
cd build
for build in ${buildArr[@]}
do
    gitHash=`git rev-parse HEAD`
    gitHash=${gitHash:(-4)}

    echo ""
    echo "Creating $build package..."
    echo ""

    cat config/config.php config/config.$build.php > config.php

    tar czf ../packages/build.$build.$gitHash.tar.gz * --exclude "config"
    rm config.php
done
cd ..

echo ""
echo "Removing build directory..."
echo ""
rm -dr build
