#!/usr/bin/env python3
#
#   Script to dereference JSON $ref in Beacon v2 Models schemas
#
#   Last Modified: Sep/01/2021
#
#   Version 2.0.0
#
#   Copyright (C) 2021-2022 Manuel Rueda (manuel.rueda@crg.eu)
#
#   This program is free software; you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation; either version 3 of the License, or
#   (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
#   GNU General Public License for more details.
#
#   You should have received a copy of the GNU General Public License
#   along with this program; if not, see <https://www.gnu.org/licenses/>.
#
#   If this program helps you in your research, please cite.

import sys
import json
#from pprint import pprint
from jsonref import JsonRef

def main():
    # Opening JSON file
    json_in = open(sys.argv[1], 'r', encoding="utf-8")
  
    # Procesing JSON file
    data = json.load(json_in)
    #pprint(JsonRef.replace_refs(data))
    json_out = JsonRef.replace_refs(data)

    # Print to STDOUT
    json.dump(json_out, sys.stdout, indent=4)

if __name__ == "__main__":
    main()
