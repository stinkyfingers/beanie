#!/bin/sh

# aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-west-1

# aws dynamodb put-item --table-name beaniebooUsers --endpoint-url http://localhost:8000 --item "{\"username\":{\"S\":\"john\"},\"password\":{\"S\":\"test\"},\"admin\":{\"S\": \"true\"}}" --region us-west-1
# #
# aws dynamodb put-item --table-name beanieboos --endpoint-url http://localhost:8000 --item "{\"name\":{\"S\":\"stinky\"},\"family\":{\"S\":\"Beanie Boos\"},\"animal\":{\"S\":\"tiger\"}}" --region us-west-1
# aws dynamodb put-item --table-name beanieboos --endpoint-url http://localhost:8000 --item "{\"name\":{\"S\":\"farty\"},\"family\":{\"S\":\"Beanie Boos\"},\"animal\":{\"S\":\"wolf\"}}" --region us-west-1
# aws dynamodb put-item --table-name beanieboos --endpoint-url http://localhost:8000 --item "{\"name\":{\"S\":\"funky\"},\"family\":{\"S\":\"Beanie Boos\"},\"animal\":{\"S\":\"dirt\"}}" --region us-west-1

# aws dynamodb delete-item --table-name beanieboos --endpoint-url http://localhost:8000 --region us-west-1 --key "{\"name\":{\"S\":\"thumby\"}}"
# aws dynamodb put-item --table-name beanieboos --endpoint-url http://localhost:8000 --item "{\"name\":{\"S\":\"aaa\"},\"family\":{\"S\":\"Beanie Babies\"},\"animal\":{\"S\":\"dirt\"},\"thumbnail\":{\"S\": \"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI//////////////////////////////////////////////////8BVVpaeGl464KC6//////////////////////////////////////////////////////////////////////////AABEIAB4AHgMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AK8ABLZGeKTGiYxKyjOB9OtTcdg2gY6EUXCxWkILnHSrJFh/1i5pMCzhi+3afrU2KvqIM5YMpAHc07BcqVRIUAW1d9gycgjvU3KQ2aRzH14zzimmJlamIVSAwJGRQBZLK0O7BAzjFKw7hMyoNuM5FCQXKtMR/9k=\"}}" --region us-west-1

# aws dynamodb batch-write-item --endpoint-url http://localhost:8000 --request-items file://beanieboos.json --region us-west-1
# aws dynamodb scan --table-name beanieboos --endpoint-url http://localhost:8000 --region us-west-1 --limit 3
# aws dynamodb query --table-name beanieboos --endpoint-url http://localhost:8000 --region us-west-1 --max-items 3 --key-conditions '{"family":{"ComparisonOperator": "EQ", "AttributeValueList":[{"S":"Beanie Boos"}]}}' --starting-token eyJFeGNsdXNpdmVTdGFydEtleSI6IG51bGwsICJib3RvX3RydW5jYXRlX2Ftb3VudCI6IDN9

# aws dynamodb scan --table-name beanieboos --region us-west-1 --profile jds --max-items 1 >> data.json
