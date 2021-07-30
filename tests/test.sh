#!/usr/bin/env bash

echo "Cleaning coverage files"
rm -rf coverage

echo ""
echo "Checking scripts with ESLint"
./node_modules/.bin/eslint src/
if [ "$?" -ne 0 ]
then
    echo ""
    echo ""
    echo "*** LINTING ERROR DISCOVERED; ABORTING ***"
    echo ""
    echo "Please make sure your scripts do not have any linting errors"
    echo ""
    echo ""
    exit 1
fi
echo ""
echo "√ ESLint check completed, okay to continue"

echo ""
echo "Running test suites with Jest"
npm run test -- --ci --coverage --watchAll=false
if [ "$?" -ne 0 ]
then
    echo ""
    echo ""
    echo "*** TESTING ERROR DISCOVERED; ABORTING ***"
    echo ""
    echo "Please make sure your unit-tests do not have any linting issues"
    echo "and that none of your snapshots are listed as obsolete"
    echo ""
    echo ""
    exit 1
fi
echo ""
echo "√ Test suites completed successfully"
