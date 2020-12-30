#!/usr/bin/env node

const AWS = require('aws-sdk');
const redis = require('redis');
const config = require('../config');

const client = redis.createClient(config.redisUrl(0));

/**
  * This script gets everything from the beanies s3 bucket and puts it in redis

  TODO
  - get images from beaniedata and add to hashed redis entry
  - replicate in live environment

*/

const region = 'us-west-1';
const bucket = 'beaniedb.john-shenk.com';
const imageBucket = 'beaniedata.john-shenk.com';
const tableName = 'beanies';

AWS.config.update({region: region});
if (process.env.NODE_ENV === 'local') {
  AWS.config.endpoint = 'http://localhost:8000';
}
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'});
const s3 = new AWS.S3();

const beanieDB = (continuationToken, startAfter) => {
  return s3.listObjectsV2({
    Bucket: bucket,
    ContinuationToken: continuationToken,
    StartAfter: startAfter
  }).promise()
    .then(resp => {
      if (resp.NextContinuationToken) {
        continuationToken = resp.NextContinuationToken
      } else {
        continuationToken = null;
      }
      return Promise.all(resp.Contents.map(item => {
        console.log(item.Key)
        const [family, name] = item.Key.replace('.json','').split('/');
        // const imageKey = `${name}.${family}`;
        return s3.getObject({
            Bucket: bucket,
            Key: item.Key.replace(/\n| |\t|\r/, ' ')
          }).promise()
          .then(object => {
            const beanie = JSON.parse(object.Body.toString());
            beanie.family = beanie.family.replace(/\n| |\t|\r/, ' ');
            return beanie;

            // return s3.getObject({
            //   Bucket: imageBucket,
            //   Key: imageKey
            // }).promise()
            // .then(imageObject => {
            //   beanie.image = imageObject.Body.toString();
            // })
            // .catch(err => {
            //   // ignore missing images
            //   if (err.toString().includes('NoSuchKey')) {
            //     return;
            //   }
            //   console.log(err)
            // })
            // .then(() => beanie)
          })
          .then(beanie => {
            return new Promise((res, rej) => {
              return client.set(`${beanie.family}:${beanie.name}`, JSON.stringify(beanie), (err, resp) => {
                if (err) rej(err);
                if (resp !== 'OK') rej(resp);
                res(beanie.name)
              });
            });
          })

        }))
      })
      .then(() => {
        if (continuationToken) beanieDB(continuationToken);
        return
      })
      .catch(console.log)
};


beanieDB(null).then(resp => resp)
// images('Tipsy.Beanie Babies').then(console.log)
