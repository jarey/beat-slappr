#!/bin/bash


##################################
#####DEFINE PACKAGES TO BUILD#####
##################################

buildArr=( lab live )


#####################################################
#####REMOVE BUILD DIRECTORY IF IT ALREADY EXISTS#####
#####################################################

if [ -d build ]
then
    echo ""
    echo "Removing build directory..."

    rm -dr build
fi


################################
#####CREATE BUILD DIRECTORY#####
################################

echo ""
echo "Creating build directory..."

mkdir build


####################
#####COPY FILES#####
####################

echo ""
echo "Copying files..."

rsync -a --exclude 'build' --exclude 'db' --exclude '.git' --exclude 'todo.txt' --exclude 'config.php' ../ build


####################
#####PACK STYLE#####
####################

echo ""
echo "Packing CSS..."

java -jar tools/yuicompressor-2.4.2.jar --line-break 8000 -v -o build/includes/style/style.css build/includes/style/style.css


######################
#####PACK SCRIPTS#####
######################

echo ""
echo "Packing JavaScript..."

catStr=""
scriptDir="build/includes/scripts"

while read line
do   
    if [ ! -z $line ]
    then
        catStr="$catStr $scriptDir/$line"
    fi
done <$scriptDir/js.list

cat $catStr > build/script.js 
rm -dr build/includes/scripts/*
mv build/script.js $scriptDir/script.js

java -jar tools/yuicompressor-2.4.2.jar --line-break 8000 -v -o $scriptDir/script.js $scriptDir/script.js


#########################################
#####SET BUILD DIRECTORY PERMISSIONS#####
#########################################

echo ""
echo "Setting build directory permissions..."

chmod -R 777 build


########################
#####BUILD PACKAGES#####
########################

if [ ! -d packages ]
then
    mkdir packages
fi

gitHash=`git rev-parse HEAD`
echo $gitHash > build/rev.txt
gitHash=${gitHash:(-4)}

cd build

for build in ${buildArr[@]}
do
    echo ""
    echo "Creating $build package..."

    mv config/config.$build.php config.php
    curDate=`date +%Y_%m_%d_%H_%M_%S`
    tar czf ../packages/build__`echo $build`__`echo $gitHash`__`echo $curDate`.tar.gz * --exclude "config"
    rm config.php
done

cd ..


################################
#####REMOVE BUILD DIRECTORY#####
################################

echo ""
echo "Removing build directory..."
echo ""

rm -dr build
