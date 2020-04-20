#!/bin/sh

# docker run -p 8000:8000 amazon/dynamodb-local

aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-west-1

# Beanies
aws dynamodb delete-table --endpoint-url http://localhost:8000  --table-name beanieboos --region us-west-1
aws dynamodb create-table --endpoint-url http://localhost:8000  --table-name beanieboos \
--attribute-definitions AttributeName=name,AttributeType=S AttributeName=family,AttributeType=S \
--key-schema AttributeName=name,KeyType=HASH \
--provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5 \
--global-secondary-indexes     \
    "[{\"IndexName\": \"family\",
    \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5},
    \"KeySchema\":[{\"AttributeName\":\"family\",\"KeyType\":\"HASH\"}],
	   \"Projection\":{\"ProjectionType\":\"INCLUDE\", \"NonKeyAttributes\":[\"animal\"]}}]" \
 --region us-west-1

# Users
aws dynamodb delete-table --endpoint-url http://localhost:8000  --table-name beaniebooUsers --region us-west-1
aws dynamodb create-table --endpoint-url http://localhost:8000  --table-name beaniebooUsers \
 --attribute-definitions AttributeName=username,AttributeType=S \
 --key-schema AttributeName=username,KeyType=HASH \
 --provisioned-throughput \
         ReadCapacityUnits=10,WriteCapacityUnits=5 \
  --region us-west-1


aws dynamodb list-tables --endpoint-url http://localhost:8000  --region us-west-1



# aws dynamodb update-item --table-name beaniebooUsers --endpoint http://localhost:8000 --key {\"username\":{\"S\":\"john\"}} --update-expression "SET admin = :t" --region us-west-1 --expression-attribute-values {\":t\":{\"S\":\"true\"}}
