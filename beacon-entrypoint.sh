#!/bin/bash

### Super Flaky Startup Script For Testing :D

cd /opt/beacon
( cd srvr/hapi && yarn serve ) &
cd uix/vue && yarn serve

