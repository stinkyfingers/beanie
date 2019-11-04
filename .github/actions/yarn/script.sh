#!/bin/sh

set -e

echo "YARNING..."

echo "command: cd $1 yarn $2"
sh -c "cd $1 yarn $2"
