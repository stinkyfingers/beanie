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
    Limit: 200,
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

  return new Promise((res, rej) => {
    return ddb.scan(params).eachPage((err, data) => {
      if (err) rej(err)
      if (!data || !data.Items) {
        res('done');
        return;
      }
      return Promise.all(data.Items.map(item => {
        const beanie = AWS.DynamoDB.Converter.unmarshall(item);
        console.log('adding', beanie.name, beanie.family)
        return s3.putObject({
          Bucket: bucket,
          Key: `${beanie.family}/${beanie.name}.json`,
          Body: Buffer.from(JSON.stringify(beanie))
        }).promise()
      }));
    })
  })
  .catch(console.log)
};


move()
  .then(console.log)
