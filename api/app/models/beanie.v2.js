const AWS = require('aws-sdk');
const redis = require('redis');
const utilities = require('./utilities');
const config = require('../config');

const region = 'us-west-1';
const dbBucket = 'beaniedb.john-shenk.com';
const imageBucket = 'beaniedata.john-shenk.com';

AWS.config.update({region: region});
if (process.env.NODE_ENV === 'live') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'}); // run locally with live db
}

const client = redis.createClient(config.redisUrl(0));

const s3 = new AWS.S3();

/**
* key creates a stringified data key
*/
const key = (family, name) => `${family}/${name}.json`;

/**
* imageKey creates a stringified image key
*/
const imageKey = (family, name) => `${name}.${family}`;

/**
  * family gets the 100 items after 'startAfter' from s3
*/
const family = (family, startAfter) => {
  const params = {
    Bucket: dbBucket,
    MaxKeys: 100,
    StartAfter: startAfter !== 'undefined' && startAfter ? key(family, startAfter) : null,
    Prefix: `${family}/`
  };

  return s3.listObjectsV2(params).promise()
    .then(res => Promise.all(res.Contents.map(obj => {
      const [family, name] = obj.Key.replace('.json', '').split('/');
      return fromCache(family, name)
        .then(beanie => {
          if (beanie) {
            return beanie;
          } else {
            return s3.getObject({
              Bucket: dbBucket,
              Key: obj.Key
            }).promise()
              .then(res => JSON.parse(res.Body.toString()))
              .then(toCache);
            };
        })
        .then(beanie => beanie);
    })));
};

/**
  * get gets an item and it's image from s3
*/
const get = (family, name) => {
  return fromCache(family, name)
    .then(beanie => {
      if (beanie) return beanie;
      return s3.getObject({
        Bucket: dbBucket,
        Key: key(family, name)
      }).promise()
        .then(object => JSON.parse(object.Body.toString()))
        .then(toCache);
    })
    .then(beanie => s3.getObject({
      Bucket: imageBucket,
      Key: imageKey(family, name)
    }).promise()
      .catch(err => {
        console.log(`no image for ${name}: ${err}`);
      })
      .then(image => {
        const img = image ? Buffer.from(image.Body).toString() : null;
        return { ...beanie, image: img };
      }))
    .catch(err => {
      if (err.code === 'NoSuchKey') return null;
    });
};

/**
  * create an item and it's image and store in s3
*/
const create = (beanie) => {
  return utilities.getBase64ImageDataAndThumbnail(beanie)
    .then(resp => {
      if (!resp) return null;
      beanie.thumbnail = resp.thumbnail;
      const image = resp.base64String;
      return s3.upload({
        Bucket: imageBucket,
        Key: imageKey(beanie.family, beanie.name),
        Body: Buffer.from(image)
      }).promise();
    })
    .then(() => s3.upload({
      Bucket: dbBucket,
      Key: key(beanie.family, beanie.name),
      Body: JSON.stringify(beanie)
    }).promise())
    .then(() => beanie)
    .then(toCache);
};

/**
  * remove an item and it's image from s3
*/
const remove = (family, name) => {
  return s3.deleteObject({
    Bucket: dbBucket,
    Key: key(family, name)
  }).promise()
    .then(() => s3.deleteObject({
      Bucket: imageBucket,
      Key: imageKey(family, name)
    }).promise())
    .then(() => unCache(family, name))
    .then(() => ({ family, name }));
};

/**
  fromCache fetches a Beanie (minus image) from Redis db 0
*/
const fromCache = (family, name) => {
  return new Promise((res, rej) => {
    return client.get(`${family}:${name}`, (err, resp) => {
      if (err) rej(err);
      res(JSON.parse(resp));
    });
  });
};

/**
  toCache places a Beanie (minus image) into Redis db 0
*/
const toCache = (beanie) => {
  return new Promise((res, rej) => {
    return client.set(`${beanie.family}:${beanie.name}`, JSON.stringify(beanie), (err) => {
      if (err) rej(err);
      res(beanie);
    });
  });
};

/**
  unCache removes a Beanie from Redis db 0
*/
const unCache = (family, name) => {
  return new Promise((res, rej) => {
    return client.del(`${family}:${name}`, (err) => {
      if (err) rej(err);
      res();
    });
  });
};

module.exports = {
  family,
  get,
  create,
  remove
};
