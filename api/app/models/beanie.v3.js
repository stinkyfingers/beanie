'use strict';
const redis = require('redis');
const utilities = require('./utilities');
const config = require('../config')
const AWS = require('aws-sdk');

const db = 0;
const client = redis.createClient(config.redisUrl(db));

const imageBucket = 'beaniedata.john-shenk.com';
/**
* imageKey creates a stringified image key
*/
const imageKey = (family, name) => `${name}.${family}`;
const region = 'us-west-1';
AWS.config.update({region: region});
if (process.env.NODE_ENV === 'live') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'}); // run locally with live db
}

const s3 = new AWS.S3();

const create = (beanie) => {
  return utilities.getBase64ImageDataAndThumbnail(beanie)
    .then(resp => {
      if (!resp) return [beanie, null];
      beanie.thumbnail = resp.thumbnail;
      const image = resp.base64String;
      return [beanie, image];
    })
    .then(([beanie, image]) => {
      if (!image) return [beanie];
      return ([beanie, s3.upload({
        Bucket: imageBucket,
        Key: imageKey(beanie.family, beanie.name),
        Body: Buffer.from(image)
      }).promise()]);
    })
    .then(([beanie]) => new Promise((res, rej) => {
      return client.set(`${beanie.family}:${beanie.name}`, JSON.stringify(beanie), (err, resp) => {
        if (err) rej(err);
        res(resp);
      });
    }))
};

const get = (family, name, omitimage = false) => {
  return new Promise((res, rej) => {
    return client.get(`${family}:${name}`, (err, resp) => {
      if (err) rej(err);
      res(JSON.parse(resp));
    });
  })
    .then(object => {
      if (omitimage) return object;
      return Promise.all([object, s3.getObject({
        Bucket: imageBucket,
        Key: imageKey(family, name)
      }).promise()])
    .then(([beanie, imageObject]) => {
      beanie.image = imageObject?.Body ? imageObject.Body.toString() : null;
      return beanie;
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
        return get(family, name, true);
      }))
        .then(res);
    });
  });
};

const remove = (family, name) => {
  return new Promise((res, rej) => {
    return client.del(`${family}:${name}`, (err, resp) => {
      if (err) rej(err);
      res({ family, name });
    });
  })
  .then(beanie => s3.deleteObject({
    Bucket: imageBucket,
    Key: imageKey(beanie.family, beanie.name)
  }).promise());
};

module.exports = {
  create,
  get,
  family,
  remove
};
