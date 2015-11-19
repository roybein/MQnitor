#!/bin/sh

meteor create .
cut -d ' ' -f1 packagesList | xargs meteor add
meteor remove autopublish
