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

rsync -a --exclude 'build' --exclude 'db' --exclude 'download/kits/*/' --exclude '.git' --exclude 'notes.txt' --exclude 'config.php' ../ build


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

#MERGE SCRIPTS TO ONE FILE
while read line
do   
    if [ ! -z $line ]
    then
        catStr="$catStr $scriptDir/$line"
    fi
done <$scriptDir/js.list

cat $catStr > build/script.js 

#REMOVE THE CONTENTS OF THE SCRIPTDIR DIRECTORY
rm -dr $scriptDir/*

#REPLACE GLOBALS
while read line
do   
    if [ ! -z $line ]
    then
        sed -i -r 's/'$line'/g' build/script.js
    fi
done <tools/globals.list

#MOVE SCRIPT.JS TO THE PROPER FOLDER
mv build/script.js $scriptDir/script.js

#OBFUSCATE SCRIPT
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

#get the hash of the git head
gitHash=`git rev-parse HEAD`

#build the rev.txt file.  This will contain the git head hash as well as build time.
echo $gitHash > build/rev.txt
echo `date +%Y_%m_%d_%H_%M_%S` >> build/rev.txt

#remove all trailing spaces from main application page.
sed -i -r 's/^[ \t]*//g' build/index.php

#trim the gitHash variable to only the last 4 characters.  This will be inserted into
#the package filename.
gitHash=${gitHash:(-4)}

cd build

for build in ${buildArr[@]}
do
    echo ""
    echo "Creating $build package..."

    #COPY BUILD-SPECIFIC FILES OVER

    mv config/config.$build.php config.php
    if [ -f config/htaccess.$build ]
    then
        mv config/htaccess.$build .htaccess
        htaccess='.htaccess'
    else
        htaccess=''
    fi
    if [ -f config/robots.$build.txt ]
    then
        mv config/robots.$build.txt robots.txt
    fi
    if [ -f config/sitemap.$build.xml ]
    then
        mv config/sitemap.$build.xml sitemap.xml
    fi
    if [ -f config/config.hotlinks.$build.php ]
    then
        mv config/config.hotlinks.$build.php hotlinks/config.php
    fi    
    if [ -f config/htaccess.hotlinks.$build ]
    then
        mv config/htaccess.hotlinks.$build hotlinks/.htaccess
    fi

    #END COPY BUILD-SPECIFIC FILES

    curDate=`date +%Y_%m_%d_%H_%M_%S`
    tar czf "../packages/build__"$curDate"__"$gitHash"__"$build".tar.gz" * $htaccess --exclude "config"
    echo "Built package build__"$curDate"__"$gitHash"__"$build".tar.gz"

    #REMOVE BUILD-SPECIFIC FILES

    rm config.php
    if [ -f .htaccess ]
    then
        rm .htaccess
    fi
    if [ -f robots.txt ]
    then
        rm robots.txt
    fi
    if [ -f sitemap.xml ]
    then
        rm sitemap.xml
    fi
    if [ -f hotlinks/config.php ]
    then
        rm hotlinks/config.php
    fi
    if [ -f hotlinks/.htaccess ]
    then
        rm hotlinks/.htaccess
    fi

    #END REMOVE BUILD-SPECIFIC FILES
done

cd ..


################################
#####REMOVE BUILD DIRECTORY#####
################################

echo ""
echo "Removing build directory..."
echo ""

rm -dr build
