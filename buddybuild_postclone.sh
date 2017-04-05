#!/bin/bash

PAGINATIONKIT_FOLDER="T3PaginationKit"
COMMITISH_OVERRIDE_FILE="COMMITISH_OVERRIDE"
BUDDYBUILD_PREBUILD_FILE="buddybuild_prebuild.sh"

if [ ! -d $PAGINATIONKIT_FOLDER ]; then
	echo "Cloning T3PaginationKit: git clone --branch mg-updated-template-tests git@github.com:dowjones-mobile/T3PaginationKit.git $PAGINATIONKIT_FOLDER"
	git clone --branch mg-updated-template-tests git@github.com:dowjones-mobile/T3PaginationKit.git $PAGINATIONKIT_FOLDER &> /dev/null
else
	echo "T3PaginationKit already exists...this is an error"
	exit 1
fi

# The prebuild script needs to sit next to the .xcodeproj file
echo "Copying BuddyBuild prebuild step into the T3PaginationKit folder"
cp $BUDDYBUILD_PREBUILD_FILE $PAGINATIONKIT_FOLDER/$BUDDYBUILD_PREBUILD_FILE

echo "Getting latest commit"
TEMPLATE_COMMITISH=$(git rev-parse HEAD)

cd $PAGINATIONKIT_FOLDER

echo "Writting $TEMPLATE_COMMITISH to disk"
echo "$TEMPLATE_COMMITISH" > "$COMMITISH_OVERRIDE_FILE"
