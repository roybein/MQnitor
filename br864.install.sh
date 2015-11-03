#!/bin/sh

meteor create .
git checkout br864
cut -d ' ' -f1 packagesList | xargs meteor add
