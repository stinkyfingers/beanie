#!/usr/bin/env node

const AWS = require('aws-sdk');

/**
  * This script gets everything from the beanies dynamo table
  * and puts it in a bucket as /<family>/<name>.json
*/

const region = 'us-west-1';
const bucket = 'beaniedb.john-shenk.com';
const tableName = 'beanies';

AWS.config.update({region: region});
if (process.env.NODE_ENV === 'local') {
  AWS.config.endpoint = 'http://localhost:8000';
}
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'});
const ddb = new AWS.DynamoDB();
const s3 = new AWS.S3();

const move = () => {
  const params = {
    TableName: tableName,
    // Limit: 400,
    // ExpressionAttributeValues: {
    // ':family': {
    //    S: 'Beanie Fashion'
    //   }
    // },
    // ExpressionAttributeNames: {
    //   '#family': 'family'
    // },
    // FilterExpression: '#family = :family'
  };

  return ddb.scan(params).promise()
  .then(resp => {
    return Promise.all(resp.Items.map(item => {
      const beanie = AWS.DynamoDB.Converter.unmarshall(item);
      console.log(beanie.name, beanie.family)
      return s3.putObject({
        Bucket: bucket,
        Key: `${beanie.family}/${beanie.name}.json`,
        Body: Buffer.from(JSON.stringify(beanie))
      }).promise()
    }))
  })
  .catch(console.log)
};


move()
  .then(console.log)
