#!/usr/bin/env node

const AWS = require('aws-sdk');
const _ = require('lodash');

/**
  * This script gets everything from the beanies dynamo table
  * and puts it in a bucket as /<family>/<name>.json
*/

const region = 'us-west-1';
const bucket = 'beanieusers.john-shenk.com';
const tableName = 'beaniebooUsers';

AWS.config.update({region: region});
if (process.env.NODE_ENV === 'local') {
  AWS.config.endpoint = 'http://localhost:8000';
}
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'});
const ddb = new AWS.DynamoDB();
const s3 = new AWS.S3();

const findBeanie = (name) => {
  const query = (family) => ddb.getItem({
    TableName: 'beanies',
    Key: {
     "name": { S: name },
     "family": { S: family }}
  });

// gross
  return query('Beanie Boos').promise()
    .then(resp => {
      if (resp.Item) {
        return AWS.DynamoDB.Converter.unmarshall(resp.Item);
      }
      return query('Beanie Babies').promise()
        .then(resp => {
          if (resp.Item) {
            return AWS.DynamoDB.Converter.unmarshall(resp.Item);
          }
        })
        return query('Beanie Fashion').promise()
          .then(resp => {
            if (resp.Item) {
              return AWS.DynamoDB.Converter.unmarshall(resp.Item)
            }
          })
          .then(resp => {
            return query('Beanie Babies 2.0').promise()
              .then(resp => {
                if (resp.Item) {
                  return AWS.DynamoDB.Converter.unmarshall(resp.Item)
                }
              })
          })
        })
        .catch(console.log)
};

const findBeanies = (beanies, beanieMap = {}) => {
  return Promise.all(beanies.map(beanie => {
    if (beanieMap[beanie]) return beanieMap[beanie];
    return findBeanie(beanie)
      .then(resp => {
        if (!resp) return;
        beanieMap[resp.name] = resp;
        return resp;
      });
  }))
  .then(all => _.compact(all));
};

const move = () => {
  const params = {
    TableName: tableName
  };

  return ddb.scan(params).promise()
  .then(resp => {
    const beanieMap = {};
    return Promise.all(resp.Items.map(item => {
      const user = AWS.DynamoDB.Converter.unmarshall(item);
      const beanies = _.get(user.beanies, 'values', []);
      const wantlist = _.get(user.wantlist, 'values', []);

      return findBeanies(beanies, beanieMap)
      .then(userBeanies => user.beanies = userBeanies)
      .then(() => {
        return findBeanies(wantlist)
      })
      .then(userBeanies => {
        user.wantlist = userBeanies;
        console.log(user.username)
        return;
      })
      .then(() => {
        return s3.putObject({
          Bucket: bucket,
          Key: `${user.username}.json`,
          Body: Buffer.from(JSON.stringify(user))
        }).promise()
        .catch(console.warn)
      });
    }));
  })
  .catch(console.log)
};

move()
  .then(console.log)
