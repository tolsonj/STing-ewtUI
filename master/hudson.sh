#!/bin/bash

id

cd /var/lib/hudson/jobs/MCF-test/workspace/master
npm install
bower install --allow-root
gulp
