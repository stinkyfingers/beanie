#!/usr/bin/env node

const AWS = require('aws-sdk');

const redis = require('redis');

const client = redis.createClient();
const db = 0;

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

const beanieDB = (continuationToken) => {
  return s3.listObjectsV2({
    Bucket: bucket,
    ContinuationToken: continuationToken
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
        const imageKey = `${name}.${family}`;
        return s3.getObject({
            Bucket: bucket,
            Key: item.Key
          }).promise()
          .then(object => {
            const beanie = JSON.parse(object.Body.toString());
            beanie.family = beanie.family.replace(/\n| |\t|\r/, ' ');

            return s3.getObject({
              Bucket: imageBucket,
              Key: imageKey
            }).promise()
            .then(imageObject => {
              beanie.image = imageObject.Body.toString();
            })
            .catch(err => {
              // ignore missing images
              if (err.toString().includes('NoSuchKey')) {
                return;
              }
              console.log(err)
            })
            .then(() => beanie)
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

// util for redis hashing
const stringify = (beanie) => {
  return [
    "name", beanie.name || '',
    "family", beanie.family || '',
    "birthday", beanie.birthday || '',
    "exclusiveTo", beanie.exclusiveTo || '',
    "tt", beanie.tt || '',
    "st", beanie.st || '',
    "retireDate", beanie.retireDate || '',
    "introDate", beanie.introDate || '',
    "length", beanie.length || '',
    "number", beanie.number || '',
    "animal", beanie.animal || '',
    "height", beanie.height || '',
    "variety", beanie.variety || '',
    "thumbnail", beanie.thumbnail || '',
    "image", beanie.image || ''
  ];
};

const images = (startAfter) => {
  return s3.listObjectsV2({
    Bucket: imageBucket,
    StartAfter: startAfter
  }).promise()
  .then(items => {
    return Promise.all(items.Contents.map(item => {
      return s3.getObject({
        Bucket: imageBucket,
        Key: item.Key // TODO
      }).promise()
        .then(resp => {
          const [name, family] = item.Key.split('.');
          console.log(family, name)
          return new Promise((res, rej) => {
            client.hmset(`${family}:${name}`, 'image', resp.Body.toString(), (err, resp) => {
              if (err) rej(err)
              console.log(resp)
            })
          })
          .then(res)
        });
      }));
  });
};

beanieDB().then(resp => resp)
// images('Tipsy.Beanie Babies').then(console.log)
