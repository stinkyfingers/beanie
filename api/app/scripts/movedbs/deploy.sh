#!/bin/sh

GOOS=linux go build -o movedbs main.go
zip movedbs.zip movedbs
aws lambda update-function-code --function-name movedbs --zip-file fileb://movedbs.zip --profile jds
