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


######################
#####PACK SCRIPTS#####
######################

#echo "Minifying JavaScript..."
#./tools/minify.php -i "build/index.js build/reference/js/fader.js build/reference/js/hijax2.js" -o "build/index.js" -delete


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
