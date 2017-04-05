#!/bin/bash

npm install -g gulp
# We are in the T3PaginationKit folder, but the templates are up a directory
cd ..
gulp verify
