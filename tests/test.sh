#!/usr/bin/env bash

echo "Cleaning coverage files"
rm -rf coverage

echo ""
echo "Checking files with ESLint"
./node_modules/.bin/eslint src/
if [ "$?" -ne 0 ]
then
    exit 1
fi
echo " done"

echo ""
echo "Running unit tests with Jest"
npm run test -- --ci --coverage --watchAll=false
