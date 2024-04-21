#!/bin/bash

### Super Flaky Startup Script For Testing :D
cd /opt/beacon

if [[ -n "${1}" ]]
then
  case "${1}" in
    srvr|hapi) cd srvr/hapi;;
      uix|vue) cd uix/vue;;
  esac
  yarn serve

else
  echo "Must Specifiy: hapi or vue" >&2
  exit 2
fi
