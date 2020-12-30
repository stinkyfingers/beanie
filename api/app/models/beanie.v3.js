'use strict';
const redis = require('redis');
const AWS = require('aws-sdk');
const utilities = require('./utilities');
const config = require('../config');

// AWS
const region = 'us-west-1';
const imageBucket = 'beaniedata.john-shenk.com';
AWS.config.update({region: region});
if (process.env.NODE_ENV === 'live') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'}); // run locally with live db
}
const s3 = new AWS.S3();

// Redis
const db = 0;
const client = redis.createClient(config.redisUrl(db));

const imageKey = (family, name) => `${name}.${family}`;

const create = (beanie) => {
  return utilities.getBase64ImageDataAndThumbnail(beanie)
    .then(resp => {
      if (!resp) return null;
      beanie.thumbnail = resp.thumbnail;
      const image = resp.base64String
      return s3.upload({
        Bucket: imageBucket,
        Key: imageKey(beanie.family, beanie.name),
        Body: Buffer.from(image)
      }).promise();
    })
    .then(() => new Promise((res, rej) => {
      return client.set(`${beanie.family}:${beanie.name}`, JSON.stringify(beanie), (err, resp) => {
        if (err) rej(err);
        res(resp);
      });
  }));
};

const get = (family, name) => {
  return s3.getObject({
    Bucket: imageBucket,
    Key: imageKey(family, name)
  }).promise()
  .then(object => {
    return new Promise((res, rej) => {
      return client.get(`${family}:${name}`, (err, resp) => {
        if (err) rej(err);
        const beanie = JSON.parse(resp);
        beanie.image = object.Body.toString();
        res(beanie);
      });
    });
  });
};

const family = (family) => {
  return new Promise((res, rej) => {
    return client.scan('0', 'match', `${family}:*`, 'count', '10000', (err, resp) => {
      if (err) rej(err);
      if (resp.length < 2) rej(`malformed response: ${resp}`);

      return Promise.all(resp[1].sort().map(key => {
        const [family, name] = key.split(':');
        return new Promise((res, rej) => {
          return client.get(`${family}:${name}`, (err, resp) => {
            if (err) rej(err);
            res(JSON.parse(resp));
          });
        });
      }))
        .then(res);
    });
  });
};

const remove = (family, name) => {
  return new Promise((res, rej) => {
    return client.del(`${family}:${name}`, (err, resp) => {
      if (err) rej(err);
      res(s3.deleteObject({
        Bucket: imageBucket,
        Key: imageKey(family, name)
      }).promise());
    });
  });
};



module.exports = {
  create,
  get,
  family,
  remove
};
